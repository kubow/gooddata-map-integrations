// (C) 2026 GoodData Corporation
import { useMemo } from "react";
import { useExecutionDataView } from "@gooddata/sdk-ui";
import { newTwoDimensional, MeasureGroupIdentifier } from "@gooddata/sdk-model";
import { backend } from "../backend.js";
import type { GeoAreaOption } from "./useGeoCatalog.js";
import {
  resolveValueMeasure,
  type ValueFieldSelection,
} from "./fieldSelection.js";

export interface AreaData {
  status: "loading" | "success" | "error";
  valueByCode: Record<string, number>;
  maxValue: number;
  error?: string;
}

/**
 * Executes an area-code + value query against GoodData and returns a code -> value lookup a
 * choropleth layer can join against boundary polygons.
 */
export function useAreaValues(
  workspace: string | undefined,
  area: GeoAreaOption | undefined,
  value: ValueFieldSelection
): AreaData {
  const execution = useMemo(() => {
    if (!workspace || !area) {
      return undefined;
    }
    const measure = resolveValueMeasure(value);
    return backend
      .workspace(workspace)
      .execution()
      .forItems([area.area, measure], [])
      .withDimensions(
        ...newTwoDimensional([area.area], [MeasureGroupIdentifier])
      );
  }, [workspace, area, value]);

  const { result, error, status } = useExecutionDataView({ execution });

  return useMemo(() => {
    if (error) {
      return {
        status: "error",
        valueByCode: {},
        maxValue: 0,
        error: error.message,
      };
    }
    if (status !== "success" || !result) {
      return { status: "loading", valueByCode: {}, maxValue: 0 };
    }

    const valueByCode: Record<string, number> = {};
    result
      .data()
      .slices()
      .toArray()
      .forEach((slice) => {
        const code = slice.sliceTitles()[0];
        const rawValue = slice.dataPoints()[0]?.rawValue;
        const parsedValue = rawValue == null ? undefined : Number(rawValue);
        if (code && parsedValue !== undefined && Number.isFinite(parsedValue)) {
          valueByCode[code] = parsedValue;
        }
      });

    const maxValue = Math.max(0, ...Object.values(valueByCode));
    return { status: "success", valueByCode, maxValue };
  }, [error, status, result]);
}
