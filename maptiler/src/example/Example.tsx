// (C) 2021-2025 GoodData Corporation
import React, { useState } from "react";
import { useWorkspace } from "@gooddata/sdk-ui";
import MapTilerDataLoader from "./MapTilerDataLoader.js";
import MapTilerDataLoaderAdvanced from "./MapTilerDataLoaderAdvanced.js";
import MapTilerMapDemo from "./MapTilerMapDemo.js";
import MapTilerHeatmapDemo from "./MapTilerHeatmapDemo.js";
import Hint from "../Hint.js";

// Flag to toggle between demo data and live GoodData connection
// Set to true to use real GoodData data with CustomerCity locations
const USE_LIVE_DATA = true;

/**
 * Example component demonstrating GoodData + MapTiler integration
 *
 * This example shows how to:
 * 1. Fetch geo data from GoodData's semantic layer
 * 2. Extract lat/lng coordinates from geo display forms
 * 3. Render interactive markers on a MapTiler map with various visualizations
 *
 * Required configuration:
 * - Set VITE_MAPTILER_TOKEN in your .env file
 * - Update catalog.ts with your geo-enabled attributes
 * - Ensure your data model has lat/lng display forms configured
 */
const Example: React.FC = () => {
  const workspace = useWorkspace();
  const [viewMode, setViewMode] = useState<"simple" | "advanced" | "heatmap">(
    "advanced"
  );

  return (
    <div className="maptiler-example">
      <h1>GoodData + MapTiler Integration</h1>

      <section className="example-section">
        <div className="map-controls">
          <button
            className={`control-button ${viewMode === "simple" ? "active" : ""}`}
            onClick={() => setViewMode("simple")}
          >
            Simple (Points Only)
          </button>
          <button
            className={`control-button ${
              viewMode === "advanced" ? "active" : ""
            }`}
            onClick={() => setViewMode("advanced")}
          >
            Advanced (Polygons + Points)
          </button>
          <button
            className={`control-button ${viewMode === "heatmap" ? "active" : ""}`}
            onClick={() => setViewMode("heatmap")}
          >
            Heatmap
          </button>
        </div>

        <h2>Interactive Map</h2>
        <p>
          This example demonstrates how to extract location data from GoodData's
          semantic layer and visualize it on a MapTiler map.{" "}
          {viewMode === "simple" ? (
            <>
              Each marker represents a city with customer data, supporting click
              interactions and popups.
            </>
          ) : viewMode === "advanced" ? (
            <>
              The <strong>advanced view</strong> combines state polygons
              (choropleth) colored by aggregated values with city point markers on
              top, using <strong>multiple metrics</strong> from GoodData. Inspired
              by{" "}
              <a
                href="https://docs.maptiler.com/sdk-js/examples/polygon-popup-on-click/"
                target="_blank"
                rel="noopener noreferrer"
              >
                MapTiler's polygon popup example
              </a>
              .
            </>
          ) : (
            <>
              The <strong>heatmap view</strong> shows data density and intensity
              using MapTiler's heatmap layer helper for smooth visualization.
            </>
          )}
        </p>

        {/* Toggle between demo data and live GoodData connection */}
        {USE_LIVE_DATA && workspace ? (
          <>
            {viewMode === "simple" && (
              <MapTilerDataLoader
                workspace={workspace}
                viewMode="markers"
              />
            )}
            {viewMode === "advanced" && (
              <MapTilerDataLoaderAdvanced workspace={workspace} />
            )}
            {viewMode === "heatmap" && (
              <MapTilerDataLoader
                workspace={workspace}
                viewMode="heatmap"
              />
            )}
          </>
        ) : (
          <>
            {viewMode === "heatmap" ? (
              <MapTilerHeatmapDemo />
            ) : (
              <MapTilerMapDemo />
            )}
          </>
        )}
      </section>

      <section className="code-example">
        <h3>How It Works</h3>
        <pre>
          <code>{`// 1. Configure MapTiler API key
import * as maptilersdk from '@maptiler/sdk';
maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_TOKEN;

// 2. Execute a GoodData query with geo display forms
const execution = backend
  .workspace(workspace)
  .execution()
  .forItems(
    [
      Md.CustomerCity.Default,              // City name
      Md.CustomerCity.CityPushpinLatitude,  // Latitude display form
      Md.CustomerCity.CityPushpinLongitude, // Longitude display form
      Md.TotalCustomers,                    // Measure for aggregation
    ],
    filters
  )
  .withDimensions(
    ...newTwoDimensional(
      // Row dimension: all three display forms of CustomerCity
      // This will give us name, lat, lng in the slice headers
      [
        Md.CustomerCity.Default,
        Md.CustomerCity.CityPushpinLatitude,
        Md.CustomerCity.CityPushpinLongitude,
      ],
      // Column dimension: measures
      [MeasureGroupIdentifier]
    )
  );

// 3. Use the GoodData hook to execute and get results
const { result, error, status } = useExecutionDataView({ execution });

// 4. Transform slices into map points
// Slice titles contain: [cityName, latitude, longitude] from the 3 display forms
// Data points contain the measure value (e.g., TotalCustomers)
const slices = result.data().slices().toArray();
const mapPoints = slices.map((slice) => {
  const titles = slice.sliceTitles();
  const dataPoints = slice.dataPoints();
  
  return {
    name: titles[0],                              // City name
    lat: parseFloat(titles[1]),                   // Latitude
    lng: parseFloat(titles[2]),                   // Longitude
    value: dataPoints[0]?.rawValue,               // Measure value
  };
});

// 5. Render on MapTiler
const map = new maptilersdk.Map({
  container: mapContainer,
  style: maptilersdk.MapStyle.STREETS,
  center: [lng, lat],
  zoom: 4,
});

// Add markers with popups
mapPoints.forEach((point) => {
  const marker = new maptilersdk.Marker({ color: getColor(point.value) })
    .setLngLat([point.lng, point.lat])
    .addTo(map);
    
  const popup = new maptilersdk.Popup({ offset: 25 })
    .setHTML(\`<strong>\${point.name}</strong><br/>Value: \${point.value}\`);
  marker.setPopup(popup);
});`}</code>
        </pre>
      </section>

      <section className="info-section">
        <h3>Features</h3>
        <ul>
          <li>Real-time data from GoodData's semantic layer</li>
          <li>
            <strong>Multiple metrics support:</strong> TotalCustomers,
            ActiveCustomers, NewCustomers
          </li>
          <li>
            <strong>Advanced view:</strong> State polygons + city points (inspired
            by{" "}
            <a
              href="https://docs.maptiler.com/sdk-js/examples/polygon-popup-on-click/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MapTiler polygon example
            </a>
            )
          </li>
          <li>Interactive markers with click handlers and popups</li>
          <li>Heatmap visualization with intensity based on values</li>
          <li>Dynamic marker coloring based on customer metrics</li>
          <li>Choropleth map coloring for state-level aggregations</li>
          <li>Multiple MapTiler map styles (Streets, Outdoor, Satellite)</li>
          <li>Navigation controls and geocoding support</li>
        </ul>
      </section>

      <Hint hint="Set USE_LIVE_DATA to true and configure catalog.ts to connect to your GoodData workspace with real location data." />
    </div>
  );
};

export default Example;
