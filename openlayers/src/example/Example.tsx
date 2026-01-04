// (C) 2021-2025 GoodData Corporation
import React, { useState } from "react";
import { useWorkspace } from "@gooddata/sdk-ui";
import OpenLayersDataLoader from "./OpenLayersDataLoader.js";
import OpenLayersDataLoaderAdvanced from "./OpenLayersDataLoaderAdvanced.js";
import Hint from "../Hint.js";

/**
 * Example component demonstrating GoodData + OpenLayers integration
 *
 * This example shows how to:
 * 1. Fetch geo data from GoodData's semantic layer
 * 2. Extract lat/lng coordinates from geo display forms
 * 3. Render interactive markers on an OpenLayers map
 *
 * Required configuration:
 * - Update catalog.ts with your geo-enabled attributes
 * - Ensure your data model has lat/lng display forms configured
 */
const Example: React.FC = () => {
  const workspace = useWorkspace();
  const [useAdvanced, setUseAdvanced] = useState(true);

  return (
    <div className="openlayers-example">
      <h1>GoodData + OpenLayers Integration</h1>

      <section className="example-section">
        <div className="map-controls">
          <button
            className={`control-button ${!useAdvanced ? "active" : ""}`}
            onClick={() => setUseAdvanced(false)}
          >
            Simple (Points Only)
          </button>
          <button
            className={`control-button ${useAdvanced ? "active" : ""}`}
            onClick={() => setUseAdvanced(true)}
          >
            Advanced (Points + State Polygons)
          </button>
        </div>

        <h2>Interactive Map</h2>
        <p>
          This example demonstrates how to extract location data from GoodData's
          semantic layer and visualize it on an OpenLayers map.{" "}
          {useAdvanced ? (
            <>
              The <strong>advanced view</strong> shows state polygons colored by
              aggregated values (using <code>CustomerState</code>) with city
              points on top.
            </>
          ) : (
            <>
              Each marker represents a location with customer data, supporting
              click interactions and popups.
            </>
          )}
        </p>

        {workspace ? (
          useAdvanced ? (
            <OpenLayersDataLoaderAdvanced workspace={workspace} />
          ) : (
            <OpenLayersDataLoader workspace={workspace} />
          )
        ) : (
          <div className="error-container">
            <p>
              Workspace not configured. Please check your environment variables.
            </p>
          </div>
        )}
      </section>

      <section className="code-example">
        <h3>How It Works</h3>
        <pre>
          <code>{`// 1. Execute a GoodData query with geo display forms
const execution = backend
  .workspace(workspace)
  .execution()
  .forItems([
    Md.CustomerCity.Default,              // City name
    Md.CustomerCity.CityPushpinLatitude,  // Latitude
    Md.CustomerCity.CityPushpinLongitude, // Longitude
    Md.TotalCustomers,                    // Measure for aggregation
  ], filters)
  .withDimensions(
    ...newTwoDimensional(
      [Md.CustomerCity.Default, 
       Md.CustomerCity.CityPushpinLatitude,
       Md.CustomerCity.CityPushpinLongitude],
      [MeasureGroupIdentifier]
    )
  );

// 2. Use the GoodData hook to get results
const { result, error, status } = useExecutionDataView({ execution });

// 3. Transform slices into map points
// sliceTitles() contains [name, lat, lng] from the 3 display forms
const mapPoints = result.data().slices().toArray().map((slice) => {
  const titles = slice.sliceTitles();
  return {
    name: titles[0],
    lat: parseFloat(titles[1]),
    lng: parseFloat(titles[2]),
    value: slice.dataPoints()[0]?.rawValue,
  };
});

// 4. Render on OpenLayers
import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";

const map = new Map({
  target: "map-container",
  layers: [
    new TileLayer({ source: new OSM() }),
    vectorLayer,
  ],
  view: new View({
    center: fromLonLat([lng, lat]),
    zoom: 4,
  }),
});

map.addSource("points", {
  features: mapPoints.map((p) => 
    new Feature({
      geometry: new Point(fromLonLat([p.lng, p.lat])),
      name: p.name,
      value: p.value,
    })
  ),
});`}</code>
        </pre>
      </section>

      <section className="info-section">
        <h3>Features</h3>
        <ul>
          <li>Real-time data from GoodData's semantic layer</li>
          <li>Interactive markers with click handlers</li>
          <li>Popup tooltips with location details</li>
          <li>Nearby points detection using Haversine formula</li>
          <li>Dynamic marker sizing and coloring based on values</li>
        </ul>
      </section>

      <Hint hint="Edit OpenLayersDataLoader.tsx to connect to your GoodData workspace with real location data." />
    </div>
  );
};

export default Example;
