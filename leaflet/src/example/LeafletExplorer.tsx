// (C) 2026 GoodData Corporation
import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useWorkspace } from "@gooddata/sdk-ui";

import {
  useGeoCatalog,
  type GeoCatalog,
  type GeoLocationOption,
  type GeoAreaOption,
} from "./useGeoCatalog.js";
import { usePushpinPoints, type PushpinPoint } from "./usePushpinPoints.js";
import { useAreaValues } from "./useAreaValues.js";
import { PushpinLayer } from "./PushpinLayer.js";
import { AreaChoroplethLayer } from "./AreaChoroplethLayer.js";
import { KNOWN_COUNTRY_CODES } from "./countryBoundaries.js";
import {
  resolveAttribute,
  type ValueFieldSelection,
  type AttributeFieldSelection,
} from "./fieldSelection.js";

// https://leafletjs.com/reference.html
// https://react-leaflet.js.org/

type Tab = "pushpin" | "area" | "combined";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "pushpin", label: "Pushpin markers" },
  { id: "area", label: "Area (choropleth)" },
  { id: "combined", label: "Combined" },
];

const TILE_LAYER = {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};

const controlStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  fontSize: "0.85em",
};
const controlsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1.5em",
  flexWrap: "wrap",
  marginBottom: "1em",
};

function firstValueSelection(
  catalog: GeoCatalog
): ValueFieldSelection | undefined {
  if (catalog.measures[0]) {
    return `measure:${catalog.measures[0].id}`;
  }
  if (catalog.facts[0]) {
    return `fact:${catalog.facts[0].id}`;
  }
  return undefined;
}

function valueLabel(catalog: GeoCatalog, value: ValueFieldSelection): string {
  const id = value.startsWith("measure:")
    ? value.slice("measure:".length)
    : value.slice("fact:".length);
  const field = value.startsWith("measure:")
    ? catalog.measures.find((m) => m.id === id)
    : catalog.facts.find((f) => f.id === id);
  return field?.title ?? id;
}

type MapView =
  | { bounds: [[number, number], [number, number]] }
  | { center: [number, number]; zoom: number };

/** Fits the map to the actual data instead of guessing a center/zoom heuristically. */
function computeMapView(points: Array<{ lat: number; lng: number }>): MapView {
  if (points.length === 0) {
    return { center: [20, 0], zoom: 2 };
  }
  if (points.length === 1) {
    return { center: [points[0].lat, points[0].lng], zoom: 6 };
  }
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  return {
    bounds: [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ],
  };
}

function ValuePicker({
  label,
  value,
  onChange,
  catalog,
}: {
  label: string;
  value: ValueFieldSelection;
  onChange: (value: ValueFieldSelection) => void;
  catalog: GeoCatalog;
}) {
  return (
    <label style={controlStyle}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ValueFieldSelection)}
      >
        {catalog.measures.length > 0 ? (
          <optgroup label="Metrics">
            {catalog.measures.map((field) => (
              <option key={`measure:${field.id}`} value={`measure:${field.id}`}>
                {field.title}
              </option>
            ))}
          </optgroup>
        ) : null}
        {catalog.facts.length > 0 ? (
          <optgroup label="Facts (sum)">
            {catalog.facts.map((field) => (
              <option key={`fact:${field.id}`} value={`fact:${field.id}`}>
                {field.title}
              </option>
            ))}
          </optgroup>
        ) : null}
      </select>
    </label>
  );
}

function SegmentPicker({
  value,
  onChange,
  catalog,
}: {
  value: AttributeFieldSelection;
  onChange: (value: AttributeFieldSelection) => void;
  catalog: GeoCatalog;
}) {
  return (
    <label style={controlStyle}>
      Segment by
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AttributeFieldSelection)}
      >
        <option value="">None</option>
        {catalog.attributes.map((field) => (
          <option key={`attribute:${field.id}`} value={`attribute:${field.id}`}>
            {field.title}
          </option>
        ))}
      </select>
    </label>
  );
}

function LocationPicker({
  locations,
  value,
  onChange,
}: {
  locations: GeoLocationOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={controlStyle}>
      Location
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {locations.map((option) => (
          <option key={option.key} value={option.key}>
            {option.attributeTitle}
          </option>
        ))}
      </select>
    </label>
  );
}

function AreaPicker({
  areas,
  value,
  onChange,
}: {
  areas: GeoAreaOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={controlStyle}>
      Area
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {areas.map((option) => (
          <option key={option.key} value={option.key}>
            {option.attributeTitle} ({option.label})
          </option>
        ))}
      </select>
    </label>
  );
}

function MapStatus({
  status,
  error,
}: {
  status: "loading" | "success" | "error";
  error?: string;
}) {
  if (status === "loading") {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading map data from GoodData…</p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <pre className="error-container">
        Failed to load map data{error ? `: ${error}` : ""}
      </pre>
    );
  }
  return null;
}

function PushpinPanel({
  catalog,
  workspace,
}: {
  catalog: GeoCatalog;
  workspace: string;
}) {
  const [locationKey, setLocationKey] = useState(
    catalog.geoLocations[0]?.key ?? ""
  );
  const [value, setValue] = useState<ValueFieldSelection | undefined>(
    firstValueSelection(catalog)
  );
  const [segmentBy, setSegmentBy] = useState<AttributeFieldSelection>("");

  const location = catalog.geoLocations.find(
    (option) => option.key === locationKey
  );

  if (!location) {
    return (
      <p>
        No latitude/longitude <code>GDC.geo.pin_*</code> display forms were
        found in this workspace, so pushpin markers cannot be built.
      </p>
    );
  }
  if (!value) {
    return (
      <p>
        No metrics or facts were found in this workspace to size/color the
        markers by.
      </p>
    );
  }

  return (
    <PushpinPanelContent
      catalog={catalog}
      workspace={workspace}
      location={location}
      locationKey={locationKey}
      onLocationChange={setLocationKey}
      value={value}
      onValueChange={setValue}
      segmentBy={segmentBy}
      onSegmentByChange={setSegmentBy}
    />
  );
}

function PushpinPanelContent({
  catalog,
  workspace,
  location,
  locationKey,
  onLocationChange,
  value,
  onValueChange,
  segmentBy,
  onSegmentByChange,
}: {
  catalog: GeoCatalog;
  workspace: string;
  location: GeoLocationOption;
  locationKey: string;
  onLocationChange: (value: string) => void;
  value: ValueFieldSelection;
  onValueChange: (value: ValueFieldSelection) => void;
  segmentBy: AttributeFieldSelection;
  onSegmentByChange: (value: AttributeFieldSelection) => void;
}) {
  const data = usePushpinPoints(
    workspace,
    location,
    value,
    resolveAttribute(segmentBy)
  );
  const view = useMemo(() => computeMapView(data.points), [data.points]);

  return (
    <div>
      <div style={controlsRowStyle}>
        <LocationPicker
          locations={catalog.geoLocations}
          value={locationKey}
          onChange={onLocationChange}
        />
        <ValuePicker
          label="Size / color"
          value={value}
          onChange={onValueChange}
          catalog={catalog}
        />
        <SegmentPicker
          value={segmentBy}
          onChange={onSegmentByChange}
          catalog={catalog}
        />
      </div>
      <div className="leaflet-container-wrapper">
        {data.status === "success" ? (
          <MapContainer
            key={`pushpin-${location.key}-${JSON.stringify(view)}`}
            {...("bounds" in view
              ? {
                  bounds: view.bounds,
                  boundsOptions: { padding: [30, 30] as [number, number] },
                }
              : { center: view.center, zoom: view.zoom })}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
          >
            <TileLayer {...TILE_LAYER} />
            <PushpinLayer
              points={data.points}
              valueLabel={valueLabel(catalog, value)}
            />
          </MapContainer>
        ) : (
          <MapStatus status={data.status} error={data.error} />
        )}
      </div>
    </div>
  );
}

function AreaPanel({
  catalog,
  workspace,
}: {
  catalog: GeoCatalog;
  workspace: string;
}) {
  const [areaKey, setAreaKey] = useState(catalog.geoAreas[0]?.key ?? "");
  const [value, setValue] = useState<ValueFieldSelection | undefined>(
    firstValueSelection(catalog)
  );

  if (catalog.geoAreas.length === 0) {
    return (
      <p>
        No <code>GDC.geo.area</code> display forms were found in this workspace,
        so a choropleth layer cannot be built.
      </p>
    );
  }
  if (!value) {
    return (
      <p>
        No metrics or facts were found in this workspace to color the regions
        by.
      </p>
    );
  }

  const area =
    catalog.geoAreas.find((option) => option.key === areaKey) ??
    catalog.geoAreas[0];

  return (
    <AreaPanelContent
      catalog={catalog}
      workspace={workspace}
      area={area}
      onAreaChange={setAreaKey}
      value={value}
      onValueChange={setValue}
    />
  );
}

function AreaPanelContent({
  catalog,
  workspace,
  area,
  onAreaChange,
  value,
  onValueChange,
}: {
  catalog: GeoCatalog;
  workspace: string;
  area: GeoAreaOption;
  onAreaChange: (value: string) => void;
  value: ValueFieldSelection;
  onValueChange: (value: ValueFieldSelection) => void;
}) {
  const data = useAreaValues(workspace, area, value);
  const matchedCodes = Object.keys(data.valueByCode).filter((code) =>
    KNOWN_COUNTRY_CODES.has(code)
  );
  const hasUnmatchedData =
    data.status === "success" &&
    Object.keys(data.valueByCode).length > 0 &&
    matchedCodes.length === 0;

  return (
    <div>
      <div style={controlsRowStyle}>
        <AreaPicker
          areas={catalog.geoAreas}
          value={area.key}
          onChange={onAreaChange}
        />
        <ValuePicker
          label="Color"
          value={value}
          onChange={onValueChange}
          catalog={catalog}
        />
      </div>
      {hasUnmatchedData ? (
        <p>
          None of the values for <strong>{area.attributeTitle}</strong> matched
          a known ISO 3166-1 country code (e.g. <code>US</code>, <code>CA</code>
          ), so no regions could be shaded. This demo's bundled boundaries only
          support country-level codes - pick a country-level geo area attribute
          here, or extend <code>countryBoundaries.ts</code> with a subdivision
          dataset to support finer-grained codes like this one.
        </p>
      ) : (
        <div className="leaflet-container-wrapper">
          {data.status === "success" ? (
            <MapContainer
              key={`area-${area.key}`}
              center={[20, 0]}
              zoom={2}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom
            >
              <TileLayer {...TILE_LAYER} />
              <AreaChoroplethLayer
                valueByCode={data.valueByCode}
                maxValue={data.maxValue}
                valueLabel={valueLabel(catalog, value)}
              />
            </MapContainer>
          ) : (
            <MapStatus status={data.status} error={data.error} />
          )}
        </div>
      )}
    </div>
  );
}

function CombinedPanel({
  catalog,
  workspace,
}: {
  catalog: GeoCatalog;
  workspace: string;
}) {
  const [locationKey, setLocationKey] = useState(
    catalog.geoLocations[0]?.key ?? ""
  );
  const [pushpinValue, setPushpinValue] = useState<
    ValueFieldSelection | undefined
  >(firstValueSelection(catalog));
  const [includeArea, setIncludeArea] = useState(catalog.geoAreas.length > 0);
  const [areaKey, setAreaKey] = useState(catalog.geoAreas[0]?.key ?? "");
  const [areaValue, setAreaValue] = useState<ValueFieldSelection | undefined>(
    firstValueSelection(catalog)
  );

  if (catalog.geoLocations.length === 0 && catalog.geoAreas.length === 0) {
    return (
      <p>
        No <code>GDC.geo.*</code> display forms were found in this workspace, so
        a combined map cannot be built.
      </p>
    );
  }
  if (!pushpinValue) {
    return (
      <p>
        No metrics or facts were found in this workspace to drive the map
        layers.
      </p>
    );
  }

  return (
    <CombinedPanelContent
      catalog={catalog}
      workspace={workspace}
      locationKey={locationKey}
      onLocationChange={setLocationKey}
      pushpinValue={pushpinValue}
      onPushpinValueChange={setPushpinValue}
      includeArea={includeArea}
      onIncludeAreaChange={setIncludeArea}
      areaKey={areaKey}
      onAreaChange={setAreaKey}
      areaValue={areaValue ?? pushpinValue}
      onAreaValueChange={setAreaValue}
    />
  );
}

function CombinedPanelContent({
  catalog,
  workspace,
  locationKey,
  onLocationChange,
  pushpinValue,
  onPushpinValueChange,
  includeArea,
  onIncludeAreaChange,
  areaKey,
  onAreaChange,
  areaValue,
  onAreaValueChange,
}: {
  catalog: GeoCatalog;
  workspace: string;
  locationKey: string;
  onLocationChange: (value: string) => void;
  pushpinValue: ValueFieldSelection;
  onPushpinValueChange: (value: ValueFieldSelection) => void;
  includeArea: boolean;
  onIncludeAreaChange: (value: boolean) => void;
  areaKey: string;
  onAreaChange: (value: string) => void;
  areaValue: ValueFieldSelection;
  onAreaValueChange: (value: ValueFieldSelection) => void;
}) {
  const location = catalog.geoLocations.find(
    (option) => option.key === locationKey
  );
  const area = catalog.geoAreas.find((option) => option.key === areaKey);

  const pushpinData = usePushpinPoints(
    workspace,
    location,
    pushpinValue,
    undefined
  );
  const areaData = useAreaValues(
    workspace,
    includeArea ? area : undefined,
    areaValue
  );

  const points: PushpinPoint[] = location ? pushpinData.points : [];
  const view = useMemo(() => computeMapView(points), [points]);
  const loading =
    (location && pushpinData.status === "loading") ||
    (includeArea && areaData.status === "loading");

  return (
    <div>
      <div style={controlsRowStyle}>
        {catalog.geoLocations.length > 0 ? (
          <>
            <LocationPicker
              locations={catalog.geoLocations}
              value={locationKey}
              onChange={onLocationChange}
            />
            <ValuePicker
              label="Pushpin size / color"
              value={pushpinValue}
              onChange={onPushpinValueChange}
              catalog={catalog}
            />
          </>
        ) : null}
        {catalog.geoAreas.length > 0 ? (
          <>
            <label style={controlStyle}>
              &nbsp;
              <span>
                <input
                  type="checkbox"
                  checked={includeArea}
                  onChange={(e) => onIncludeAreaChange(e.target.checked)}
                />{" "}
                Add area layer
              </span>
            </label>
            {includeArea ? (
              <>
                <AreaPicker
                  areas={catalog.geoAreas}
                  value={areaKey}
                  onChange={onAreaChange}
                />
                <ValuePicker
                  label="Area color"
                  value={areaValue}
                  onChange={onAreaValueChange}
                  catalog={catalog}
                />
              </>
            ) : null}
          </>
        ) : null}
      </div>
      <div className="leaflet-container-wrapper">
        {loading ? (
          <MapStatus status="loading" />
        ) : (
          <MapContainer
            key={`combined-${locationKey}-${areaKey}-${includeArea}-${JSON.stringify(
              view
            )}`}
            {...("bounds" in view
              ? {
                  bounds: view.bounds,
                  boundsOptions: { padding: [30, 30] as [number, number] },
                }
              : { center: view.center, zoom: view.zoom })}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
          >
            <TileLayer {...TILE_LAYER} />
            {includeArea && area && areaData.status === "success" ? (
              <AreaChoroplethLayer
                valueByCode={areaData.valueByCode}
                maxValue={areaData.maxValue}
                valueLabel={valueLabel(catalog, areaValue)}
              />
            ) : null}
            {location && pushpinData.status === "success" ? (
              <PushpinLayer
                points={pushpinData.points}
                valueLabel={valueLabel(catalog, pushpinValue)}
              />
            ) : null}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

const LeafletExplorer: React.FC = () => {
  const workspace = useWorkspace();
  const catalogState = useGeoCatalog(workspace);
  const [tab, setTab] = useState<Tab>("pushpin");

  if (catalogState.status === "loading") {
    return <p>Loading geo catalog…</p>;
  }
  if (catalogState.status === "error") {
    return (
      <pre className="error-container">
        Failed to load geo catalog: {catalogState.error}
      </pre>
    );
  }
  if (!workspace) {
    return null;
  }

  const catalog = catalogState.catalog;

  return (
    <div>
      <div
        role="tablist"
        style={{ display: "flex", gap: "0.5em", marginBottom: "1em" }}
      >
        {TABS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={tab === option.id}
            onClick={() => setTab(option.id)}
            style={{ fontWeight: tab === option.id ? "bold" : "normal" }}
          >
            {option.label}
          </button>
        ))}
      </div>
      {tab === "pushpin" ? (
        <PushpinPanel catalog={catalog} workspace={workspace} />
      ) : null}
      {tab === "area" ? (
        <AreaPanel catalog={catalog} workspace={workspace} />
      ) : null}
      {tab === "combined" ? (
        <CombinedPanel catalog={catalog} workspace={workspace} />
      ) : null}
    </div>
  );
};

export default LeafletExplorer;
