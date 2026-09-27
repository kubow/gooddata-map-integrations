// (C) 2026 GoodData Corporation
import { useEffect, useRef, useState } from "react";
import {
  Map as MapTilerMap,
  Popup,
  MapStyle,
  config,
  type LayerSpecification,
  type MapLayerMouseEvent,
} from "@maptiler/sdk";
import { countryBoundaries } from "./countryBoundaries.js";
import type { PushpinPoint } from "./usePushpinPoints.js";

export type MapView =
  | { bounds: [[number, number], [number, number]] }
  | { center: [number, number]; zoom: number };

/** Fits the map to the actual data instead of guessing a center/zoom heuristically. */
export function computeMapView(
  points: Array<{ lat: number; lng: number }>
): MapView {
  if (points.length === 0) {
    return { center: [20, 0], zoom: 1.5 };
  }
  if (points.length === 1) {
    return { center: [points[0].lat, points[0].lng], zoom: 6 };
  }
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  return {
    bounds: [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ],
  };
}

function removeLayersAndSources(
  map: MapTilerMap,
  layerIds: string[],
  sourceIds: string[]
) {
  layerIds.forEach((id) => {
    if (map.getLayer(id)) {
      map.removeLayer(id);
    }
  });
  sourceIds.forEach((id) => {
    if (map.getSource(id)) {
      map.removeSource(id);
    }
  });
}

/** Creates the MapTiler map instance once and tears it down on unmount. */
export function useMapTilerInstance(
  containerRef: React.RefObject<HTMLDivElement | null>
): MapTilerMap | null {
  const [map, setMap] = useState<MapTilerMap | null>(null);
  const mapRef = useRef<MapTilerMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }
    config.apiKey = import.meta.env.VITE_MAPTILER_TOKEN as string;
    const instance = new MapTilerMap({
      container: containerRef.current,
      style: MapStyle.STREETS,
      center: [0, 20],
      zoom: 1.5,
    });
    mapRef.current = instance;
    setMap(instance);
    return () => {
      instance.remove();
      mapRef.current = null;
      setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return map;
}

/**
 * Tracks whether the map's style has finished its one-time initial load.
 *
 * @remarks
 * `map.loaded()` is a *transient* flag - it goes back to `false` whenever tiles are in flight
 * (e.g. right after `fitBounds`/`flyTo`), which is entirely unrelated to "has the style loaded at
 * least once". Layer-adding code only needs the latter, so every layer hook below depends on this
 * instead of re-checking `map.loaded()` itself (which caused layers to silently never render
 * whenever the map happened to be mid-pan/zoom the first time their effect ran).
 */
function useMapReady(map: MapTilerMap | null): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!map) {
      setReady(false);
      return;
    }
    if (map.isStyleLoaded()) {
      setReady(true);
      return;
    }
    const onLoad = () => setReady(true);
    map.once("load", onLoad);
    return () => {
      map.off("load", onLoad);
    };
  }, [map]);

  return ready;
}

/** Moves the camera to fit the current data whenever the view changes. */
export function useMapView(map: MapTilerMap | null, view: MapView): void {
  const ready = useMapReady(map);

  useEffect(() => {
    if (!map || !ready) {
      return;
    }
    if ("bounds" in view) {
      const [[southLat, westLng], [northLat, eastLng]] = view.bounds;
      map.fitBounds(
        [
          [westLng, southLat],
          [eastLng, northLat],
        ],
        { padding: 40, maxZoom: 8, animate: true }
      );
    } else {
      map.flyTo({
        center: [view.center[1], view.center[0]],
        zoom: view.zoom,
        essential: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ready, JSON.stringify(view)]);
}

const SEGMENT_PALETTE = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

function gradientColor(value: number, maxValue: number): string {
  const normalized = maxValue > 0 ? value / maxValue : 0;
  const r = Math.round(255 * normalized);
  const b = Math.round(255 * (1 - normalized));
  return `rgb(${r}, 100, ${b})`;
}

const PUSHPIN_SOURCE = "pushpin-source";
const PUSHPIN_LAYER = "pushpin-circle";

/**
 * Renders GoodData location + value (+ optional segment) data as a data-driven `circle` layer.
 *
 * @remarks
 * MapTiler/MapLibre's `Marker` class only supports a fixed-size pin icon (color alone), so size
 * encoding is done with a GeoJSON source + `circle` layer instead - the same technique the
 * heatmap's point layer already uses, and the MapTiler/MapLibre-native equivalent of a Leaflet
 * `CircleMarker` or sdk-ui-geo's pushpin layer.
 */
export function usePushpinMarkers(
  map: MapTilerMap | null,
  points: PushpinPoint[],
  valueLabel: string,
  visible: boolean
): void {
  const ready = useMapReady(map);
  const popupRef = useRef<Popup | null>(null);

  useEffect(() => {
    if (!map || !ready) {
      return;
    }

    removeLayersAndSources(map, [PUSHPIN_LAYER], [PUSHPIN_SOURCE]);
    if (!visible) {
      return;
    }

    const maxValue = (() => {
      const values = points
        .filter((p) => p.value !== undefined)
        .map((p) => p.value as number);
      return values.length > 0 ? Math.max(...values) : 1;
    })();
    const segmentOrder: string[] = [];
    points.forEach((point) => {
      if (point.segment && !segmentOrder.includes(point.segment)) {
        segmentOrder.push(point.segment);
      }
    });

    map.addSource(PUSHPIN_SOURCE, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: points.map((point) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [point.lng, point.lat] },
          properties: {
            name: point.name,
            value: point.value ?? null,
            segment: point.segment ?? null,
            color: point.segment
              ? SEGMENT_PALETTE[
                  segmentOrder.indexOf(point.segment) % SEGMENT_PALETTE.length
                ]
              : gradientColor(point.value ?? 0, maxValue),
          },
        })),
      },
    });

    map.addLayer({
      id: PUSHPIN_LAYER,
      type: "circle",
      source: PUSHPIN_SOURCE,
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "value"], 0],
          0,
          6,
          maxValue || 1,
          18,
        ],
        "circle-color": ["get", "color"],
        "circle-opacity": 0.75,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 1,
      },
    } as LayerSpecification);

    const popup = new Popup({ offset: 12 });
    popupRef.current = popup;

    const onClick = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) {
        return;
      }
      const { name, value, segment } = feature.properties as {
        name: string;
        value: number | null;
        segment: string | null;
      };
      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<div class="maptiler-popup">
            <strong>${name}</strong>
            ${segment ? `<p>${segment}</p>` : ""}
            ${
              value !== null
                ? `<p>${valueLabel}: <span class="value">${value.toLocaleString()}</span></p>`
                : ""
            }
          </div>`
        )
        .addTo(map);
    };
    const onEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const onLeave = () => {
      map.getCanvas().style.cursor = "";
    };
    map.on("click", PUSHPIN_LAYER, onClick);
    map.on("mouseenter", PUSHPIN_LAYER, onEnter);
    map.on("mouseleave", PUSHPIN_LAYER, onLeave);

    return () => {
      map.off("click", PUSHPIN_LAYER, onClick);
      map.off("mouseenter", PUSHPIN_LAYER, onEnter);
      map.off("mouseleave", PUSHPIN_LAYER, onLeave);
      popup.remove();
      popupRef.current = null;
      removeLayersAndSources(map, [PUSHPIN_LAYER], [PUSHPIN_SOURCE]);
    };
  }, [map, ready, points, valueLabel, visible]);
}

const HEATMAP_SOURCE = "heatmap-source";
const HEATMAP_LAYER = "heatmap-layer";
const HEATMAP_POINT_LAYER = "heatmap-point";

/** Renders point data as MapTiler's native heatmap layer - an alternative to individual markers. */
export function useHeatmapLayer(
  map: MapTilerMap | null,
  points: PushpinPoint[],
  visible: boolean
): void {
  const ready = useMapReady(map);

  useEffect(() => {
    if (!map || !ready) {
      return;
    }

    removeLayersAndSources(
      map,
      [HEATMAP_LAYER, HEATMAP_POINT_LAYER],
      [HEATMAP_SOURCE]
    );
    if (!visible || points.length === 0) {
      return;
    }
    const maxValue = Math.max(1, ...points.map((p) => p.value ?? 0));

    map.addSource(HEATMAP_SOURCE, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: points.map((point) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [point.lng, point.lat] },
          properties: { value: point.value ?? 0, name: point.name },
        })),
      },
    });

    map.addLayer({
      id: HEATMAP_LAYER,
      type: "heatmap",
      source: HEATMAP_SOURCE,
      paint: {
        "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["get", "value"],
          0,
          0,
          maxValue,
          1,
        ],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(33,102,172,0)",
          0.2,
          "rgb(103,169,207)",
          0.4,
          "rgb(209,229,240)",
          0.6,
          "rgb(253,219,199)",
          0.8,
          "rgb(239,138,98)",
          1,
          "rgb(178,24,43)",
        ],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
        "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
      },
    } as LayerSpecification);

    map.addLayer({
      id: HEATMAP_POINT_LAYER,
      type: "circle",
      source: HEATMAP_SOURCE,
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["get", "value"],
          0,
          5,
          maxValue,
          20,
        ],
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", "value"],
          0,
          "rgba(33,102,172,0.8)",
          maxValue / 2,
          "rgba(253,219,199,0.8)",
          maxValue,
          "rgba(178,24,43,0.8)",
        ],
        "circle-stroke-color": "white",
        "circle-stroke-width": 1,
        "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
      },
    } as LayerSpecification);

    return () =>
      removeLayersAndSources(
        map,
        [HEATMAP_LAYER, HEATMAP_POINT_LAYER],
        [HEATMAP_SOURCE]
      );
  }, [map, ready, points, visible]);
}

const AREA_SOURCE = "area-choropleth-source";
const AREA_FILL_LAYER = "area-choropleth-fill";
const AREA_LINE_LAYER = "area-choropleth-line";

/**
 * Renders GoodData `GDC.geo.area` country values as a MapLibre-style GeoJSON choropleth - the
 * MapTiler/MapLibre-native equivalent of sdk-ui-geo's area (choropleth) layer.
 */
export function useAreaChoroplethLayer(
  map: MapTilerMap | null,
  valueByCode: Record<string, number>,
  maxValue: number,
  valueLabel: string,
  visible: boolean
): void {
  const ready = useMapReady(map);
  const popupRef = useRef<Popup | null>(null);

  useEffect(() => {
    if (!map || !ready) {
      return;
    }

    removeLayersAndSources(
      map,
      [AREA_FILL_LAYER, AREA_LINE_LAYER],
      [AREA_SOURCE]
    );
    if (!visible) {
      return;
    }

    const enriched = {
      ...countryBoundaries,
      features: countryBoundaries.features.map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          value: valueByCode[feature.properties.alpha2] ?? null,
        },
      })),
    };

    map.addSource(AREA_SOURCE, { type: "geojson", data: enriched });

    map.addLayer({
      id: AREA_FILL_LAYER,
      type: "fill",
      source: AREA_SOURCE,
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "value"], null],
          "#e5e7eb",
          [
            "interpolate",
            ["linear"],
            ["get", "value"],
            0,
            "hsl(215,70%,85%)",
            maxValue || 1,
            "hsl(215,70%,30%)",
          ],
        ],
        "fill-opacity": ["case", ["==", ["get", "value"], null], 0.15, 0.75],
      },
    } as LayerSpecification);

    map.addLayer({
      id: AREA_LINE_LAYER,
      type: "line",
      source: AREA_SOURCE,
      paint: { "line-color": "#475569", "line-width": 1 },
    } as LayerSpecification);

    const popup = new Popup({ closeButton: false });
    popupRef.current = popup;

    const onMove = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) {
        return;
      }
      const { name, value } = feature.properties as {
        name: string;
        value: number | null;
      };
      map.getCanvas().style.cursor = "pointer";
      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<strong>${name}</strong>${
            value !== null
              ? `<br/>${valueLabel}: ${value.toLocaleString()}`
              : "<br/>No data"
          }`
        )
        .addTo(map);
    };
    const onLeave = () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    };
    map.on("mousemove", AREA_FILL_LAYER, onMove);
    map.on("mouseleave", AREA_FILL_LAYER, onLeave);

    return () => {
      map.off("mousemove", AREA_FILL_LAYER, onMove);
      map.off("mouseleave", AREA_FILL_LAYER, onLeave);
      popup.remove();
      popupRef.current = null;
      removeLayersAndSources(
        map,
        [AREA_FILL_LAYER, AREA_LINE_LAYER],
        [AREA_SOURCE]
      );
    };
  }, [map, ready, valueByCode, maxValue, valueLabel, visible]);
}
