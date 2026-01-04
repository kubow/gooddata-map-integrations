// (C) 2021-2025 GoodData Corporation
import React from "react";
import { useExecutionDataView } from "@gooddata/sdk-ui";
import {
  INullableFilter,
  newTwoDimensional,
  MeasureGroupIdentifier,
} from "@gooddata/sdk-model";
import OpenLayersMap from "./OpenLayersMap.js";
import * as Md from "../catalog.js";
import { backend } from "../backend.js";

// Suppress unused Md warning - it's used when configured with real catalog
void Md;

// Define the shape of our map data point
export interface MapDataPoint {
  name: string;
  lat: number;
  lng: number;
  value?: number;
}

interface OpenLayersDataLoaderProps {
  workspace: string;
}

/**
 * OpenLayersDataLoader - Demonstrates how to extract geo data from GoodData's semantic layer
 * and prepare it for display on an OpenLayers map.
 *
 * This component uses the GoodData SDK's execution engine to:
 * 1. Query location data (latitude/longitude) from the semantic model
 * 2. Transform the raw data into a format suitable for map markers
 * 3. Pass the processed data to the OpenLayersMap component for visualization
 *
 * Pattern: Include lat/lng display forms in dimensions so their values
 * appear in the slice headers.
 */
const OpenLayersDataLoader: React.FC<OpenLayersDataLoaderProps> = ({
  workspace,
}) => {
  // Define filters (empty array = no filters, but you can add attribute or date filters here)
  const filters: INullableFilter[] = [];

  // Create execution with city name, lat, lng display forms and a measure
  // All three display forms are of the same attribute, so they'll have the same cardinality
  const execution = backend
    .workspace(workspace)
    .execution()
    .forItems(
      [
        // City name for display
        Md.CustomerCity.Default,
        // Geo coordinates as display forms
        Md.CustomerCity.CityPushpinLatitude,
        Md.CustomerCity.CityPushpinLongitude,
        // A measure for aggregation
        Md.TotalCustomers,
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

  // Use the GoodData hook to execute the query and get results
  const { result, error, status } = useExecutionDataView({
    execution,
  });

  // Handle error state
  if (error) {
    // Log full error details for debugging
    console.error("GoodData execution error:", error);
    console.error("Error name:", error.name);
    console.error("Error cause:", (error as any).cause);

    return (
      <div className="error-container">
        <h3>Error loading map data</h3>
        <p>
          <strong>Error:</strong> {error.message}
        </p>
        <p>
          <strong>Type:</strong> {error.name}
        </p>
        {(error as any).cause && (
          <p>
            <strong>Cause:</strong> {String((error as any).cause)}
          </p>
        )}
        <p>
          Make sure your catalog.ts is properly configured with location
          attributes and you have access to the workspace.
        </p>
        <details>
          <summary>Debug Info</summary>
          <pre style={{ fontSize: "10px", overflow: "auto" }}>
            {JSON.stringify({ workspace, error }, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  // Handle loading state
  if (status !== "success" || !result) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading map data from GoodData...</p>
      </div>
    );
  }

  // Log the result structure for debugging
  console.log("GoodData Result:", result);

  // Transform GoodData results into map-friendly format
  // Slice titles contain: [cityName, latitude, longitude] from the 3 display forms
  // Data points contain the measure value (e.g., TotalCustomers)
  const slices = result.data().slices().toArray();
  console.log("Slices:", slices);

  const mapPoints: MapDataPoint[] = slices
    .map((slice: any) => {
      const titles = slice.sliceTitles();
      const dataPoints = slice.dataPoints();

      // Get city name from first display form (index 0)
      const name = titles[0] || "Unknown";

      // Get lat/lng from the geo display forms (indices 1 and 2)
      const lat = parseFloat(titles[1]) || 0;
      const lng = parseFloat(titles[2]) || 0;

      // Get the measure value (e.g., customer count) for sizing/tooltips
      const value = dataPoints[0]?.rawValue
        ? parseFloat(String(dataPoints[0].rawValue))
        : undefined;

      return {
        name,
        lat,
        lng,
        value,
      };
    })
    .filter((point: MapDataPoint) => point.lat !== 0 && point.lng !== 0); // Filter out invalid coords

  console.log("OpenLayers Map Points:", mapPoints);

  return <OpenLayersMap points={mapPoints} />;
};

export default OpenLayersDataLoader;
