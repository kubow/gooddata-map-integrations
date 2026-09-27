// (C) 2026 GoodData Corporation
import { useMemo } from "react";
import { useExecutionDataView } from "@gooddata/sdk-ui";
import {
  newTwoDimensional,
  MeasureGroupIdentifier,
  type IAttribute,
} from "@gooddata/sdk-model";
import { backend } from "../backend.js";
import type { GeoLocationOption } from "./useGeoCatalog.js";
import {
  resolveValueMeasure,
  type ValueFieldSelection,
} from "./fieldSelection.js";

export interface PushpinPoint {
  name: string;
  lat: number;
  lng: number;
  value?: number;
  segment?: string;
}

export interface PushpinData {
  status: "loading" | "success" | "error";
  points: PushpinPoint[];
  error?: string;
}

/**
 * Executes a location + value (+ optional segment) query against GoodData and shapes the result
 * into plain points a Leaflet `CircleMarker` layer can render directly.
 */
export function usePushpinPoints(
  workspace: string | undefined,
  location: GeoLocationOption | undefined,
  value: ValueFieldSelection,
  segmentBy: IAttribute | undefined
): PushpinData {
  const execution = useMemo(() => {
    if (!workspace || !location) {
      return undefined;
    }
    const rowAttributes = [
      location.name,
      location.latitude,
      location.longitude,
      ...(segmentBy ? [segmentBy] : []),
    ];
    const measure = resolveValueMeasure(value);
    return backend
      .workspace(workspace)
      .execution()
      .forItems([...rowAttributes, measure], [])
      .withDimensions(
        ...newTwoDimensional(rowAttributes, [MeasureGroupIdentifier])
      );
  }, [workspace, location, value, segmentBy]);

  const { result, error, status } = useExecutionDataView({ execution });

  return useMemo(() => {
    if (error) {
      return { status: "error", points: [], error: error.message };
    }
    if (status !== "success" || !result) {
      return { status: "loading", points: [] };
    }

    const points: PushpinPoint[] = result
      .data()
      .slices()
      .toArray()
      .map((slice) => {
        const titles = slice.sliceTitles();
        const rawValue = slice.dataPoints()[0]?.rawValue;
        const parsedValue = rawValue == null ? undefined : Number(rawValue);
        return {
          name: titles[0] || "Unknown",
          lat: Number(titles[1]),
          lng: Number(titles[2]),
          value:
            parsedValue !== undefined && Number.isFinite(parsedValue)
              ? parsedValue
              : undefined,
          segment: segmentBy ? titles[3] ?? undefined : undefined,
        };
      })
      .filter(
        (point) =>
          Number.isFinite(point.lat) &&
          Number.isFinite(point.lng) &&
          point.lat >= -90 &&
          point.lat <= 90 &&
          point.lng >= -180 &&
          point.lng <= 180
      );

    return { status: "success", points };
  }, [error, status, result, segmentBy]);
}
