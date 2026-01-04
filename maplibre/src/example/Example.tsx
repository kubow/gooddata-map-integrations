// (C) 2021-2025 GoodData Corporation
import React, { useState } from "react";
import { useWorkspace } from "@gooddata/sdk-ui";
import MapLibreDataLoader from "./MapLibreDataLoader.js";
import Hint from "../Hint.js";

// Flag to toggle between demo data and live GoodData connection
// Set to true to use real GoodData data with CustomerCity locations
const USE_LIVE_DATA = true;

/**
 * Example component demonstrating GoodData + MapLibre GL JS integration
 *
 * This example shows how to:
 * 1. Fetch geo data from GoodData's semantic layer
 * 2. Extract lat/lng coordinates from geo display forms
 * 3. Render interactive markers on a MapLibre map with various visualizations
 *
 * Required configuration:
 * - Update catalog.ts with your geo-enabled attributes
 * - Ensure your data model has lat/lng display forms configured
 * - No API key required! Uses free OpenStreetMap tiles
 */
const Example: React.FC = () => {
  const workspace = useWorkspace();
  const [viewMode, setViewMode] = useState<"markers" | "heatmap">("markers");

  return (
    <div className="maplibre-example">
      <h1>GoodData + MapLibre GL JS Integration</h1>

      <section className="example-section">
        <div className="map-controls">
          <button
            className={`control-button ${viewMode === "markers" ? "active" : ""}`}
            onClick={() => setViewMode("markers")}
          >
            Markers
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
          semantic layer and visualize it on a MapLibre GL map.{" "}
          {viewMode === "markers" ? (
            <>
              Each marker represents a city with customer data, supporting click
              interactions and popups.
            </>
          ) : (
            <>
              The <strong>heatmap view</strong> shows data density and intensity
              using MapLibre's heatmap layer for smooth visualization.
            </>
          )}
        </p>

        {/* Toggle between demo data and live GoodData connection */}
        {USE_LIVE_DATA && workspace ? (
          <MapLibreDataLoader workspace={workspace} viewMode={viewMode} />
        ) : (
          <div className="demo-message">
            <p>Configure USE_LIVE_DATA and workspace to see live data.</p>
          </div>
        )}
      </section>

      <section className="code-example">
        <h3>How It Works</h3>
        <pre>
          <code>{`// 1. Import MapLibre GL JS
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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
      [
        Md.CustomerCity.Default,
        Md.CustomerCity.CityPushpinLatitude,
        Md.CustomerCity.CityPushpinLongitude,
      ],
      [MeasureGroupIdentifier]
    )
  );

// 3. Use the GoodData hook to execute and get results
const { result, error, status } = useExecutionDataView({ execution });

// 4. Transform slices into map points
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

// 5. Render on MapLibre (using free OpenStreetMap tiles)
const map = new maplibregl.Map({
  container: mapContainer,
  style: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
      },
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
  },
  center: [lng, lat],
  zoom: 4,
});

// Add markers with popups
mapPoints.forEach((point) => {
  const marker = new maplibregl.Marker({ color: getColor(point.value) })
    .setLngLat([point.lng, point.lat])
    .addTo(map);
    
  const popup = new maplibregl.Popup({ offset: 25 })
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
            <strong>Open-source MapLibre GL JS</strong> - No API key required!
          </li>
          <li>
            <strong>Free OpenStreetMap tiles</strong> - No usage limits
          </li>
          <li>
            <strong>Multiple metrics support:</strong> TotalCustomers,
            ActiveCustomers, NewCustomers
          </li>
          <li>Interactive markers with click handlers and popups</li>
          <li>Heatmap visualization with intensity based on values</li>
          <li>Dynamic marker coloring based on customer metrics</li>
          <li>Navigation controls and zoom support</li>
          <li>Lightweight and performant</li>
        </ul>
      </section>

      <Hint hint="No API key required! MapLibre GL JS uses free OpenStreetMap tiles. Just configure catalog.ts to connect to your GoodData workspace with real location data." />
    </div>
  );
};

export default Example;
