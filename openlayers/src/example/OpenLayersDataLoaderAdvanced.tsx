// (C) 2021-2025 GoodData Corporation
import React from "react";
import { useExecutionDataView } from "@gooddata/sdk-ui";
import { INullableFilter, newTwoDimensional, MeasureGroupIdentifier } from "@gooddata/sdk-model";
import OpenLayersMapAdvanced from "./OpenLayersMapAdvanced.js";
import * as Md from "../catalog.js";
import { backend } from "../backend.js";

// Suppress unused Md warning
void Md;

export interface MapDataPoint {
  name: string;
  lat: number;
  lng: number;
  value?: number;
}

interface StateData {
  name: string;
  value: number;
}

interface OpenLayersDataLoaderAdvancedProps {
  workspace: string;
}

/**
 * OpenLayersDataLoaderAdvanced - Loads both city points and state-level aggregations
 *
 * This component:
 * 1. Fetches city-level data with lat/lng for point markers
 * 2. Fetches state-level aggregations for polygon coloring
 * 3. Combines both datasets for multi-layer visualization
 */
const OpenLayersDataLoaderAdvanced: React.FC<OpenLayersDataLoaderAdvancedProps> = ({ workspace }) => {
  const filters: INullableFilter[] = [];

  // Query 1: City-level data with coordinates
  const cityExecution = backend
    .workspace(workspace)
    .execution()
    .forItems(
      [
        Md.CustomerCity.Default,
        Md.CustomerCity.CityPushpinLatitude,
        Md.CustomerCity.CityPushpinLongitude,
        Md.TotalCustomers,
      ],
      filters
    )
    .withDimensions(
      ...newTwoDimensional(
        [Md.CustomerCity.Default, Md.CustomerCity.CityPushpinLatitude, Md.CustomerCity.CityPushpinLongitude],
        [MeasureGroupIdentifier]
      )
    );

  // Query 2: State-level aggregations
  const stateExecution = backend
    .workspace(workspace)
    .execution()
    .forItems([Md.CustomerState, Md.TotalCustomers], filters)
    .withDimensions(...newTwoDimensional([Md.CustomerState], [MeasureGroupIdentifier]));

  // Execute both queries
  const cityResult = useExecutionDataView({ execution: cityExecution });
  const stateResult = useExecutionDataView({ execution: stateExecution });

  // Handle errors
  if (cityResult.error || stateResult.error) {
    const error = cityResult.error || stateResult.error;
    console.error("GoodData execution error:", error);

    return (
      <div className="error-container">
        <h3>Error loading map data</h3>
        <p>
          <strong>Error:</strong> {error?.message}
        </p>
        <p>
          Make sure your catalog.ts is properly configured with CustomerCity (with lat/lng display forms) and
          CustomerState attributes.
        </p>
      </div>
    );
  }

  // Handle loading state
  if (
    cityResult.status !== "success" ||
    !cityResult.result ||
    stateResult.status !== "success" ||
    !stateResult.result
  ) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading map data from GoodData...</p>
      </div>
    );
  }

  // Transform city data
  const citySlices = cityResult.result.data().slices().toArray();
  const mapPoints: MapDataPoint[] = citySlices
    .map((slice: any) => {
      const titles = slice.sliceTitles();
      const dataPoints = slice.dataPoints();

      return {
        name: titles[0] || "Unknown",
        lat: parseFloat(titles[1]) || 0,
        lng: parseFloat(titles[2]) || 0,
        value: dataPoints[0]?.rawValue ? parseFloat(String(dataPoints[0].rawValue)) : undefined,
      };
    })
    .filter((point: MapDataPoint) => point.lat !== 0 && point.lng !== 0);

  // Transform state data
  const stateSlices = stateResult.result.data().slices().toArray();
  const stateData: StateData[] = stateSlices.map((slice: any) => {
    const titles = slice.sliceTitles();
    const dataPoints = slice.dataPoints();

    return {
      name: titles[0] || "Unknown",
      value: dataPoints[0]?.rawValue ? parseFloat(String(dataPoints[0].rawValue)) : 0,
    };
  });

  console.log("City Points:", mapPoints);
  console.log("State Data:", stateData);

  return <OpenLayersMapAdvanced points={mapPoints} stateData={stateData} />;
};

export default OpenLayersDataLoaderAdvanced;

