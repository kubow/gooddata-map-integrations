// (C) 2026 GoodData Corporation
import { useEffect, useState } from "react";
import {
  geoLayerTypeFromVisualizationType,
  insightRef,
  insightTitle,
  insightVisualizationType,
  type ObjRef,
} from "@gooddata/sdk-model";
import { backend } from "../backend.js";

export interface GeoInsightOption {
  ref: ObjRef;
  title: string;
}

export interface GeoInsightsState {
  status: "loading" | "success" | "error";
  pushpinInsights: GeoInsightOption[];
  areaInsights: GeoInsightOption[];
  error?: string;
}

const EMPTY: GeoInsightOption[] = [];

/**
 * Finds insights already saved in the workspace that use the pushpin or area geo visualization,
 * so the explorer can always try the default insight before falling back to an ad-hoc chart.
 */
export function useGeoInsights(
  workspace: string | undefined
): GeoInsightsState {
  const [state, setState] = useState<GeoInsightsState>({
    status: "loading",
    pushpinInsights: EMPTY,
    areaInsights: EMPTY,
  });

  useEffect(() => {
    if (!workspace) {
      return;
    }
    let cancelled = false;

    const load = async () => {
      setState({
        status: "loading",
        pushpinInsights: EMPTY,
        areaInsights: EMPTY,
      });
      try {
        const firstPage = await backend
          .workspace(workspace)
          .insights()
          .getInsights({ limit: 200 });
        const insights = await firstPage.all();

        const pushpinInsights: GeoInsightOption[] = [];
        const areaInsights: GeoInsightOption[] = [];

        insights.forEach((insight) => {
          const layerType = geoLayerTypeFromVisualizationType(
            insightVisualizationType(insight)
          );
          if (!layerType) {
            return;
          }
          const option: GeoInsightOption = {
            ref: insightRef(insight),
            title: insightTitle(insight),
          };
          if (layerType === "pushpin") {
            pushpinInsights.push(option);
          } else {
            areaInsights.push(option);
          }
        });

        if (!cancelled) {
          setState({ status: "success", pushpinInsights, areaInsights });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            pushpinInsights: EMPTY,
            areaInsights: EMPTY,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [workspace]);

  return state;
}
