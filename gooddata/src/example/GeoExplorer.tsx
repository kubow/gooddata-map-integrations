// (C) 2026 GoodData Corporation
import React, { useState } from "react";
import { useWorkspace } from "@gooddata/sdk-ui";
import { InsightView } from "@gooddata/sdk-ui-ext";
import {
  newAttribute,
  newMeasure,
  idRef,
  type IAttribute,
  type IMeasure,
} from "@gooddata/sdk-model";
import {
  GeoChart,
  GeoPushpinChart,
  GeoAreaChart,
  createPushpinLayer,
  createAreaLayer,
  type IGeoLayer,
} from "@gooddata/sdk-ui-geo";

import { useGeoCatalog, type GeoCatalog } from "./useGeoCatalog.js";
import { useGeoInsights, type GeoInsightOption } from "./useGeoInsights.js";
import { formatError } from "./formatError.js";

// https://www.gooddata.com/docs/gooddata-ui/latest/references/visual_components/geo_chart
// https://www.gooddata.com/docs/gooddata-ui/latest/references/visual_components/geo_pushpin_chart
// https://www.gooddata.com/docs/gooddata-ui/latest/references/visual_components/geo_area_chart

type Tab = "pushpin" | "area" | "combined";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "pushpin", label: "Pushpin chart" },
  { id: "area", label: "Area chart" },
  { id: "combined", label: "Combined (multi-layer)" },
];

// Free OSM raster tiles so the example runs without a Mapbox/MapTiler token configured.
const MAP_CONFIG = {
  points: { groupNearbyPoints: false },
  viewport: { area: "auto" as const },
  separators: { thousand: ",", decimal: "." },
  mapStyle: {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors",
      },
    },
    layers: [{ id: "osm", type: "raster", source: "osm" }],
  } as any,
};

type FieldSelection =
  | ""
  | `attribute:${string}`
  | `measure:${string}`
  | `fact:${string}`;

function resolveAttribute(selection: FieldSelection): IAttribute | undefined {
  return selection.startsWith("attribute:")
    ? newAttribute(selection.slice("attribute:".length))
    : undefined;
}

function resolveMeasure(selection: FieldSelection): IMeasure | undefined {
  if (selection.startsWith("measure:")) {
    return newMeasure(idRef(selection.slice("measure:".length), "measure"));
  }
  if (selection.startsWith("fact:")) {
    return newMeasure(idRef(selection.slice("fact:".length), "fact"), (m) =>
      m.aggregation("sum")
    );
  }
  return undefined;
}

function resolveAttributeOrMeasure(
  selection: FieldSelection
): IAttribute | IMeasure | undefined {
  return resolveAttribute(selection) ?? resolveMeasure(selection);
}

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

function FieldPicker({
  label,
  value,
  onChange,
  catalog,
  kinds,
}: {
  label: string;
  value: FieldSelection;
  onChange: (value: FieldSelection) => void;
  catalog: GeoCatalog;
  kinds: Array<"attribute" | "measure" | "fact">;
}) {
  return (
    <label style={controlStyle}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FieldSelection)}
      >
        <option value="">None</option>
        {kinds.includes("attribute") && catalog.attributes.length > 0 ? (
          <optgroup label="Attributes">
            {catalog.attributes.map((field) => (
              <option
                key={`attribute:${field.id}`}
                value={`attribute:${field.id}`}
              >
                {field.title}
              </option>
            ))}
          </optgroup>
        ) : null}
        {kinds.includes("measure") && catalog.measures.length > 0 ? (
          <optgroup label="Metrics">
            {catalog.measures.map((field) => (
              <option key={`measure:${field.id}`} value={`measure:${field.id}`}>
                {field.title}
              </option>
            ))}
          </optgroup>
        ) : null}
        {kinds.includes("fact") && catalog.facts.length > 0 ? (
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

function MapFrame({
  error,
  children,
}: {
  error: unknown;
  children: React.ReactNode;
}) {
  return (
    <>
      {error ? (
        <pre className="error-container">
          GeoChart error:
          {"\n"}
          {formatError(error)}
        </pre>
      ) : null}
      <div style={{ height: 420, width: "100%" }}>{children}</div>
    </>
  );
}

function DefaultInsightNotice({ title }: { title: string }) {
  return (
    <p>
      Showing default insight <strong>{title}</strong>.
    </p>
  );
}

function FallbackNotice({
  hadInsightCandidates,
}: {
  hadInsightCandidates: boolean;
}) {
  if (!hadInsightCandidates) {
    return null;
  }
  return (
    <p>
      The default insight failed to load - showing an ad-hoc chart built from
      the catalog instead.
    </p>
  );
}

function PushpinPanel({
  catalog,
  insights,
}: {
  catalog: GeoCatalog;
  insights: GeoInsightOption[];
}) {
  const [insightFailed, setInsightFailed] = useState(false);
  const [locationKey, setLocationKey] = useState(
    catalog.geoLocations[0]?.key ?? ""
  );
  const [size, setSize] = useState<FieldSelection>("");
  const [color, setColor] = useState<FieldSelection>("");
  const [segmentBy, setSegmentBy] = useState<FieldSelection>("");
  const [error, setError] = useState<unknown>(null);

  const defaultInsight = insights[0];
  if (defaultInsight && !insightFailed) {
    return (
      <div>
        <DefaultInsightNotice title={defaultInsight.title} />
        <div style={{ height: 420 }}>
          <InsightView
            insight={defaultInsight.ref}
            onError={() => setInsightFailed(true)}
          />
        </div>
      </div>
    );
  }

  const location =
    catalog.geoLocations.find((option) => option.key === locationKey) ??
    catalog.geoLocations[0];
  if (!location) {
    return (
      <p>
        No latitude/longitude <code>GDC.geo.pin_*</code> display forms were
        found in this workspace, so a pushpin chart cannot be built.
      </p>
    );
  }

  return (
    <div>
      <FallbackNotice hadInsightCandidates={insights.length > 0} />
      <div style={controlsRowStyle}>
        <label style={controlStyle}>
          Location
          <select
            value={location.key}
            onChange={(e) => setLocationKey(e.target.value)}
          >
            {catalog.geoLocations.map((option) => (
              <option key={option.key} value={option.key}>
                {option.attributeTitle}
              </option>
            ))}
          </select>
        </label>
        <FieldPicker
          label="Size"
          value={size}
          onChange={setSize}
          catalog={catalog}
          kinds={["measure", "fact"]}
        />
        <FieldPicker
          label="Color"
          value={color}
          onChange={setColor}
          catalog={catalog}
          kinds={["attribute", "measure", "fact"]}
        />
        <FieldPicker
          label="Segment by"
          value={segmentBy}
          onChange={setSegmentBy}
          catalog={catalog}
          kinds={["attribute"]}
        />
      </div>
      <MapFrame error={error}>
        <GeoPushpinChart
          latitude={location.latitude}
          longitude={location.longitude}
          size={resolveAttributeOrMeasure(size)}
          color={resolveAttributeOrMeasure(color)}
          segmentBy={resolveAttribute(segmentBy)}
          config={MAP_CONFIG}
          onError={setError}
        />
      </MapFrame>
    </div>
  );
}

function AreaPanel({
  catalog,
  insights,
}: {
  catalog: GeoCatalog;
  insights: GeoInsightOption[];
}) {
  const [insightFailed, setInsightFailed] = useState(false);
  const [areaKey, setAreaKey] = useState(catalog.geoAreas[0]?.key ?? "");
  const [color, setColor] = useState<FieldSelection>("");
  const [segmentBy, setSegmentBy] = useState<FieldSelection>("");
  const [error, setError] = useState<unknown>(null);

  // Area charts only make sense when the workspace actually has geo area labels - check for
  // them before trying either the default insight or the ad-hoc fallback.
  if (catalog.geoAreas.length === 0) {
    return (
      <p>
        No <code>GDC.geo.area</code> display forms were found in this workspace,
        so an area (choropleth) chart cannot be built. Add a geo area label to
        an attribute's display form in the workspace metadata to enable this
        option.
      </p>
    );
  }

  const defaultInsight = insights[0];
  if (defaultInsight && !insightFailed) {
    return (
      <div>
        <DefaultInsightNotice title={defaultInsight.title} />
        <div style={{ height: 420 }}>
          <InsightView
            insight={defaultInsight.ref}
            onError={() => setInsightFailed(true)}
          />
        </div>
      </div>
    );
  }

  const area =
    catalog.geoAreas.find((option) => option.key === areaKey) ??
    catalog.geoAreas[0];

  return (
    <div>
      <FallbackNotice hadInsightCandidates={insights.length > 0} />
      <div style={controlsRowStyle}>
        <label style={controlStyle}>
          Area
          <select value={area.key} onChange={(e) => setAreaKey(e.target.value)}>
            {catalog.geoAreas.map((option) => (
              <option key={option.key} value={option.key}>
                {option.attributeTitle} ({option.label})
              </option>
            ))}
          </select>
        </label>
        <FieldPicker
          label="Color"
          value={color}
          onChange={setColor}
          catalog={catalog}
          kinds={["measure", "fact"]}
        />
        <FieldPicker
          label="Segment by"
          value={segmentBy}
          onChange={setSegmentBy}
          catalog={catalog}
          kinds={["attribute"]}
        />
      </div>
      <MapFrame error={error}>
        <GeoAreaChart
          area={area.area}
          color={resolveAttributeOrMeasure(color)}
          segmentBy={resolveAttribute(segmentBy)}
          config={MAP_CONFIG}
          onError={setError}
        />
      </MapFrame>
    </div>
  );
}

function CombinedPanel({ catalog }: { catalog: GeoCatalog }) {
  const [locationKey, setLocationKey] = useState(
    catalog.geoLocations[0]?.key ?? ""
  );
  const [size, setSize] = useState<FieldSelection>("");
  const [includeArea, setIncludeArea] = useState(catalog.geoAreas.length > 0);
  const [areaKey, setAreaKey] = useState(catalog.geoAreas[0]?.key ?? "");
  const [areaColor, setAreaColor] = useState<FieldSelection>("");
  const [error, setError] = useState<unknown>(null);

  const location = catalog.geoLocations.find(
    (option) => option.key === locationKey
  );
  const area = catalog.geoAreas.find((option) => option.key === areaKey);

  const layers: IGeoLayer[] = [];
  if (includeArea && area) {
    layers.push(
      createAreaLayer({
        area: area.area,
        color: resolveAttributeOrMeasure(areaColor),
      })
    );
  }
  if (location) {
    layers.push(
      createPushpinLayer({
        latitude: location.latitude,
        longitude: location.longitude,
        size: resolveAttributeOrMeasure(size),
      })
    );
  }

  if (layers.length === 0) {
    return (
      <p>
        No <code>GDC.geo.*</code> display forms were found in this workspace, so
        a combined multi-layer chart cannot be built.
      </p>
    );
  }

  return (
    <div>
      <p>
        Multi-layer <code>GeoChart</code> combines a pushpin and an area layer.
        It has no equivalent Analytical Designer insight, so this option is
        always built from the catalog.
      </p>
      <div style={controlsRowStyle}>
        {catalog.geoLocations.length > 0 ? (
          <>
            <label style={controlStyle}>
              Pushpin location
              <select
                value={locationKey}
                onChange={(e) => setLocationKey(e.target.value)}
              >
                <option value="">None</option>
                {catalog.geoLocations.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.attributeTitle}
                  </option>
                ))}
              </select>
            </label>
            <FieldPicker
              label="Pushpin size"
              value={size}
              onChange={setSize}
              catalog={catalog}
              kinds={["measure", "fact"]}
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
                  onChange={(e) => setIncludeArea(e.target.checked)}
                />{" "}
                Add area layer
              </span>
            </label>
            {includeArea ? (
              <>
                <label style={controlStyle}>
                  Area
                  <select
                    value={areaKey}
                    onChange={(e) => setAreaKey(e.target.value)}
                  >
                    {catalog.geoAreas.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.attributeTitle}
                      </option>
                    ))}
                  </select>
                </label>
                <FieldPicker
                  label="Area color"
                  value={areaColor}
                  onChange={setAreaColor}
                  catalog={catalog}
                  kinds={["measure", "fact"]}
                />
              </>
            ) : null}
          </>
        ) : null}
      </div>
      <MapFrame error={error}>
        <GeoChart layers={layers} config={MAP_CONFIG} onError={setError} />
      </MapFrame>
    </div>
  );
}

const GeoExplorer: React.FC = () => {
  const workspace = useWorkspace();
  const catalogState = useGeoCatalog(workspace);
  const insightsState = useGeoInsights(workspace);
  const [tab, setTab] = useState<Tab>("pushpin");

  if (catalogState.status === "loading" || insightsState.status === "loading") {
    return <p>Loading geo catalog…</p>;
  }
  if (catalogState.status === "error") {
    return (
      <pre className="error-container">
        Failed to load geo catalog: {catalogState.error}
      </pre>
    );
  }

  const catalog = catalogState.catalog;
  const pushpinInsights =
    insightsState.status === "success" ? insightsState.pushpinInsights : [];
  const areaInsights =
    insightsState.status === "success" ? insightsState.areaInsights : [];

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
        <PushpinPanel catalog={catalog} insights={pushpinInsights} />
      ) : null}
      {tab === "area" ? (
        <AreaPanel catalog={catalog} insights={areaInsights} />
      ) : null}
      {tab === "combined" ? <CombinedPanel catalog={catalog} /> : null}
    </div>
  );
};

export default GeoExplorer;
