// (C) 2026 GoodData Corporation
import React, { useRef, useState } from "react";
import { useWorkspace } from "@gooddata/sdk-ui";

import {
  useGeoCatalog,
  type GeoCatalog,
  type GeoLocationOption,
  type GeoAreaOption,
} from "./useGeoCatalog.js";
import { usePushpinPoints } from "./usePushpinPoints.js";
import { useAreaValues } from "./useAreaValues.js";
import { KNOWN_COUNTRY_CODES } from "./countryBoundaries.js";
import {
  resolveAttribute,
  type ValueFieldSelection,
  type AttributeFieldSelection,
} from "./fieldSelection.js";
import {
  useMapTilerInstance,
  useMapView,
  usePushpinMarkers,
  useHeatmapLayer,
  useAreaChoroplethLayer,
  computeMapView,
} from "./useMapTilerLayers.js";

// https://docs.maptiler.com/sdk-js/

type Tab = "pushpin" | "area" | "combined";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "pushpin", label: "Pushpin markers" },
  { id: "area", label: "Area (choropleth)" },
  { id: "combined", label: "Combined" },
];

// Used only when a workspace has neither measures nor facts at all - the execution then simply
// resolves no data, and the "no metrics or facts" message above already explains why.
const NO_VALUE_SELECTION: ValueFieldSelection = "measure:__none__";

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

function MapTilerExplorer(): React.ReactElement | null {
  const workspace = useWorkspace();
  const catalogState = useGeoCatalog(workspace);

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

  return (
    <MapTilerExplorerContent
      catalog={catalogState.catalog}
      workspace={workspace}
    />
  );
}

function MapTilerExplorerContent({
  catalog,
  workspace,
}: {
  catalog: GeoCatalog;
  workspace: string;
}) {
  const [tab, setTab] = useState<Tab>("pushpin");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMapTilerInstance(mapContainerRef);

  const [locationKey, setLocationKey] = useState(
    catalog.geoLocations[0]?.key ?? ""
  );
  const [pushpinValue, setPushpinValue] = useState<ValueFieldSelection>(
    firstValueSelection(catalog) ?? NO_VALUE_SELECTION
  );
  const [segmentBy, setSegmentBy] = useState<AttributeFieldSelection>("");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [areaKey, setAreaKey] = useState(catalog.geoAreas[0]?.key ?? "");
  const [areaValue, setAreaValue] = useState<ValueFieldSelection>(
    firstValueSelection(catalog) ?? NO_VALUE_SELECTION
  );

  const location = catalog.geoLocations.find(
    (option) => option.key === locationKey
  );
  const area = catalog.geoAreas.find((option) => option.key === areaKey);

  const noLocations = catalog.geoLocations.length === 0;
  const noAreas = catalog.geoAreas.length === 0;
  const noValueFields = !firstValueSelection(catalog);

  const showPushpin = tab === "pushpin" || tab === "combined";
  const showArea = tab === "area" || tab === "combined";

  const pushpinData = usePushpinPoints(
    workspace,
    location,
    pushpinValue,
    resolveAttribute(segmentBy)
  );
  const areaData = useAreaValues(workspace, area, areaValue);

  const activePoints =
    pushpinData.status === "success" && showPushpin ? pushpinData.points : [];
  const matchedCodes = Object.keys(areaData.valueByCode).filter((code) =>
    KNOWN_COUNTRY_CODES.has(code)
  );
  const hasUnmatchedAreaData =
    showArea &&
    areaData.status === "success" &&
    Object.keys(areaData.valueByCode).length > 0 &&
    matchedCodes.length === 0;

  useMapView(map, computeMapView(activePoints));
  usePushpinMarkers(
    map,
    pushpinData.status === "success" ? pushpinData.points : [],
    valueLabel(catalog, pushpinValue),
    showPushpin && !noLocations && !showHeatmap
  );
  useHeatmapLayer(
    map,
    pushpinData.status === "success" ? pushpinData.points : [],
    showPushpin && !noLocations && showHeatmap
  );
  useAreaChoroplethLayer(
    map,
    hasUnmatchedAreaData ? {} : areaData.valueByCode,
    areaData.maxValue,
    valueLabel(catalog, areaValue),
    showArea && !noAreas && !hasUnmatchedAreaData
  );

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

      {noValueFields ? (
        <p>
          No metrics or facts were found in this workspace to drive the map
          layers.
        </p>
      ) : null}

      {tab === "pushpin" && noLocations ? (
        <p>
          No latitude/longitude <code>GDC.geo.pin_*</code> display forms were
          found in this workspace, so pushpin markers cannot be built.
        </p>
      ) : null}
      {tab === "area" && noAreas ? (
        <p>
          No <code>GDC.geo.area</code> display forms were found in this
          workspace, so a choropleth layer cannot be built.
        </p>
      ) : null}
      {tab === "combined" && noLocations && noAreas ? (
        <p>
          No <code>GDC.geo.*</code> display forms were found in this workspace,
          so a combined map cannot be built.
        </p>
      ) : null}

      {!noValueFields ? (
        <div style={controlsRowStyle}>
          {showPushpin && !noLocations ? (
            <>
              <LocationPicker
                locations={catalog.geoLocations}
                value={locationKey}
                onChange={setLocationKey}
              />
              <ValuePicker
                label="Size / color"
                value={pushpinValue}
                onChange={setPushpinValue}
                catalog={catalog}
              />
              <SegmentPicker
                value={segmentBy}
                onChange={setSegmentBy}
                catalog={catalog}
              />
              <label style={controlStyle}>
                &nbsp;
                <span>
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                  />{" "}
                  Show as heatmap
                </span>
              </label>
            </>
          ) : null}
          {showArea && !noAreas ? (
            <>
              <AreaPicker
                areas={catalog.geoAreas}
                value={areaKey}
                onChange={setAreaKey}
              />
              <ValuePicker
                label="Area color"
                value={areaValue}
                onChange={setAreaValue}
                catalog={catalog}
              />
            </>
          ) : null}
        </div>
      ) : null}

      {hasUnmatchedAreaData && area ? (
        <p>
          None of the values for <strong>{area.attributeTitle}</strong> matched
          a known ISO 3166-1 country code (e.g. <code>US</code>, <code>CA</code>
          ), so no regions could be shaded. This demo's bundled boundaries only
          support country-level codes - pick a country-level geo area attribute
          here, or extend <code>countryBoundaries.ts</code> with a subdivision
          dataset to support finer-grained codes like this one.
        </p>
      ) : null}

      <div className="maptiler-container-wrapper">
        <div
          ref={mapContainerRef}
          className="maptiler-container"
          style={{ width: "100%", height: "600px" }}
        />
      </div>
    </div>
  );
}

export default MapTilerExplorer;
