// (C) 2021-2025 GoodData Corporation
import React from "react";
import { useExecutionDataView } from "@gooddata/sdk-ui";
import {
  INullableFilter,
  newTwoDimensional,
  MeasureGroupIdentifier,
} from "@gooddata/sdk-model";
import MapTilerMapAdvanced from "./MapTilerMapAdvanced.js";
import * as Md from "../catalog.js";
import { backend } from "../backend.js";

// Suppress unused Md warning
void Md;

export interface MapDataPoint {
  name: string;
  lat: number;
  lng: number;
  metrics: {
    totalCustomers?: number;
    activeCustomers?: number;
    newCustomers?: number;
  };
}

interface StateData {
  name: string;
  metrics: {
    totalCustomers?: number;
    activeCustomers?: number;
    newCustomers?: number;
  };
}

interface MapTilerDataLoaderAdvancedProps {
  workspace: string;
}

/**
 * MapTilerDataLoaderAdvanced - Loads both city points and state-level aggregations
 * with multiple metrics
 *
 * This component:
 * 1. Fetches city-level data with lat/lng for point markers (3 metrics)
 * 2. Fetches state-level aggregations for polygon coloring (3 metrics)
 * 3. Combines both datasets for multi-layer visualization
 */
const MapTilerDataLoaderAdvanced: React.FC<
  MapTilerDataLoaderAdvancedProps
> = ({ workspace }) => {
  const filters: INullableFilter[] = [];

  // Query 1: City-level data with coordinates and multiple metrics
  const cityExecution = backend
    .workspace(workspace)
    .execution()
    .forItems(
      [
        // City name and geo coordinates
        Md.CustomerCity.Default,
        Md.CustomerCity.CityPushpinLatitude,
        Md.CustomerCity.CityPushpinLongitude,
        // Multiple metrics
        Md.TotalCustomers,
        Md.ActiveCustomers,
        Md.NewCustomers,
      ],
      filters
    )
    .withDimensions(
      ...newTwoDimensional(
        // Row dimension: city display forms
        [
          Md.CustomerCity.Default,
          Md.CustomerCity.CityPushpinLatitude,
          Md.CustomerCity.CityPushpinLongitude,
        ],
        // Column dimension: measures
        [MeasureGroupIdentifier]
      )
    );

  // Query 2: State-level aggregations with multiple metrics
  const stateExecution = backend
    .workspace(workspace)
    .execution()
    .forItems(
      [
        Md.CustomerState,
        Md.TotalCustomers,
        Md.ActiveCustomers,
        Md.NewCustomers,
      ],
      filters
    )
    .withDimensions(
      ...newTwoDimensional([Md.CustomerState], [MeasureGroupIdentifier])
    );

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
          Make sure your catalog.ts is properly configured with CustomerCity
          (with lat/lng display forms) and CustomerState attributes.
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

  // Transform city data with multiple metrics
  const citySlices = cityResult.result.data().slices().toArray();
  const mapPoints: MapDataPoint[] = citySlices
    .map((slice: any) => {
      const titles = slice.sliceTitles();
      const dataPoints = slice.dataPoints();

      return {
        name: titles[0] || "Unknown",
        lat: parseFloat(titles[1]) || 0,
        lng: parseFloat(titles[2]) || 0,
        metrics: {
          totalCustomers: dataPoints[0]?.rawValue
            ? parseFloat(String(dataPoints[0].rawValue))
            : undefined,
          activeCustomers: dataPoints[1]?.rawValue
            ? parseFloat(String(dataPoints[1].rawValue))
            : undefined,
          newCustomers: dataPoints[2]?.rawValue
            ? parseFloat(String(dataPoints[2].rawValue))
            : undefined,
        },
      };
    })
    .filter((point: MapDataPoint) => point.lat !== 0 && point.lng !== 0);

  // Transform state data with multiple metrics
  const stateSlices = stateResult.result.data().slices().toArray();
  const stateData: StateData[] = stateSlices.map((slice: any) => {
    const titles = slice.sliceTitles();
    const dataPoints = slice.dataPoints();

    return {
      name: titles[0] || "Unknown",
      metrics: {
        totalCustomers: dataPoints[0]?.rawValue
          ? parseFloat(String(dataPoints[0].rawValue))
          : 0,
        activeCustomers: dataPoints[1]?.rawValue
          ? parseFloat(String(dataPoints[1].rawValue))
          : 0,
        newCustomers: dataPoints[2]?.rawValue
          ? parseFloat(String(dataPoints[2].rawValue))
          : 0,
      },
    };
  });

  console.log("🗺️  City Points with metrics:", mapPoints);
  console.log("🗺️  State Data with metrics:", stateData);

  return <MapTilerMapAdvanced points={mapPoints} stateData={stateData} />;
};

export default MapTilerDataLoaderAdvanced;

