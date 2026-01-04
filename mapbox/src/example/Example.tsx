// (C) 2021-2025 GoodData Corporation
import React from "react";
import { useWorkspace } from "@gooddata/sdk-ui";
import MapBoxDataLoader from "./MapBoxDataLoader.js";

/**
 * Example component demonstrating GoodData + MapBox integration
 *
 * This example shows how to:
 * 1. Fetch geo data from GoodData's semantic layer
 * 2. Extract lat/lng coordinates from geo display forms
 * 3. Render interactive markers on a MapBox map
 *
 * Required configuration:
 * - Set VITE_MAPBOX_TOKEN in your .env file
 * - Update catalog.ts with your geo-enabled attributes
 * - Ensure your data model has lat/lng display forms configured
 */
const Example: React.FC = () => {
  const workspace = useWorkspace();

  return (
    <div className="mapbox-example">
      <h1>GoodData + MapBox Integration</h1>

      <section className="example-section">
        <h2>Interactive Map</h2>
        <p>
          This example demonstrates how to extract location data from GoodData's
          semantic layer and visualize it on a MapBox map. Each marker represents
          a location with customer data, supporting click interactions, popups,
          and reverse geocoding.
        </p>

        {workspace ? (
          <MapBoxDataLoader workspace={workspace} />
        ) : (
          <div className="error-container">
            <p>Workspace not configured. Please check your environment variables.</p>
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
    Md.CustomerCity.Default,           // City name
    Md.CustomerCity.CityPushpinLatitude,  // Latitude
    Md.CustomerCity.CityPushpinLongitude, // Longitude
    Md.TotalCustomers,                 // Measure for aggregation
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
    lngLat: [parseFloat(titles[2]), parseFloat(titles[1])],
  };
});

// 4. Render on MapBox
const map = new mapboxgl.Map({
  container: "mapbox-container",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-74.0, 40.75],
  zoom: 3,
});

map.addSource("points", {
  type: "geojson",
  data: {
    type: "FeatureCollection",
    features: mapPoints.map((p) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: p.lngLat },
      properties: { title: p.name },
    })),
  },
});`}</code>
        </pre>
      </section>

      <section className="info-section">
        <h3>Features</h3>
        <ul>
          <li>Real-time data from GoodData's semantic layer</li>
          <li>Interactive markers with click handlers</li>
          <li>Popup tooltips with location details</li>
          <li>Reverse geocoding via MapBox API</li>
          <li>Nearby points detection using Haversine formula</li>
        </ul>
      </section>
    </div>
  );
};

export default Example;

