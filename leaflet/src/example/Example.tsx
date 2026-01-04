// (C) 2021-2025 GoodData Corporation
import React from "react";
import { useWorkspace } from "@gooddata/sdk-ui";
import LeafletDataLoader from "./LeafletDataLoader.js";
import LeafletMapDemo from "./LeafletMapDemo.js";
import Hint from "../Hint.js";

// Flag to toggle between demo data and live GoodData connection
const USE_LIVE_DATA = false;

/**
 * Example component demonstrating GoodData + Leaflet integration
 *
 * This example shows two approaches:
 * 1. LeafletDataLoader: Fetches real data from GoodData's semantic layer
 * 2. LeafletMapDemo: Displays the map with sample data (for demonstration)
 *
 * To use with your own GoodData workspace:
 * 1. Update the catalog.ts with your location attributes
 * 2. Configure the LeafletDataLoader with the correct attribute references
 * 3. Set USE_LIVE_DATA to true
 */
const Example: React.FC = () => {
    const workspace = useWorkspace();

    return (
        <div className="leaflet-example">
            <h1>GoodData + Leaflet Integration</h1>

            <section className="example-section">
                <h2>Interactive Map</h2>
                <p>
                    This example demonstrates how to extract location data from GoodData's semantic layer
                    and visualize it on a Leaflet map. The markers below represent data points with size
                    and color based on their values.
                </p>

                {/* Toggle between demo data and live GoodData connection */}
                {USE_LIVE_DATA && workspace ? (
                    <LeafletDataLoader workspace={workspace} />
                ) : (
                    <LeafletMapDemo />
                )}
            </section>

            <section className="code-example">
                <h3>How It Works</h3>
                <pre>
                    <code>{`// 1. Create execution with display forms for location data
const execution = backend
    .workspace(workspace)
    .execution()
    .forItems([
        Md.CustomerCity.Default,           // City name
        Md.CustomerCity.CityPushpinLatitude,  // Lat display form
        Md.CustomerCity.CityPushpinLongitude, // Lng display form
        Md.TotalCustomers,                 // Measure for value
    ], filters)
    .withDimensions(
        ...newTwoDimensional(
            // Row: display forms appear in slice headers
            [Md.CustomerCity.Default, Md.CustomerCity.CityPushpinLatitude, 
             Md.CustomerCity.CityPushpinLongitude],
            // Column: measures
            [MeasureGroupIdentifier]
        )
    );

// 2. Use the GoodData hook to execute and get results
const { result, error, status } = useExecutionDataView({ execution });

// 3. Extract data from slice titles and data points
const mapPoints = result.data().slices().toArray().map((slice) => ({
    name: slice.sliceTitles()[0],      // City name
    lat: parseFloat(slice.sliceTitles()[1]),  // Latitude
    lng: parseFloat(slice.sliceTitles()[2]),  // Longitude
    value: slice.dataPoints()[0]?.rawValue,   // Measure value
}));

// 4. Render on Leaflet
<MapContainer center={[lat, lng]} zoom={4}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {mapPoints.map((point) => (
        <CircleMarker 
            center={[point.lat, point.lng]}
            radius={getRadius(point.value)}
        >
            <Popup>{point.name}: {point.value}</Popup>
        </CircleMarker>
    ))}
</MapContainer>`}</code>
                </pre>
            </section>

            <Hint hint="Edit LeafletDataLoader.tsx to connect to your GoodData workspace with real location data." />
        </div>
    );
};

export default Example;
