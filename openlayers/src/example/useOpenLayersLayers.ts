// (C) 2026 GoodData Corporation
import { useEffect, useRef, useState } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import HeatmapLayer from "ol/layer/Heatmap";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Overlay from "ol/Overlay";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import type { MapBrowserEvent } from "ol";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
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

/** Creates the OpenLayers map (+ a shared click-popup overlay) once and tears it down on unmount. */
export function useOpenLayersInstance(
  containerRef: React.RefObject<HTMLDivElement | null>,
  popupRef: React.RefObject<HTMLDivElement | null>
): { map: OlMap | null; overlay: Overlay | null } {
  const [map, setMap] = useState<OlMap | null>(null);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const mapRef = useRef<OlMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || !popupRef.current || mapRef.current) {
      return;
    }

    const overlayInstance = new Overlay({
      element: popupRef.current,
      autoPan: { animation: { duration: 250 } },
    });

    const instance = new OlMap({
      target: containerRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      overlays: [overlayInstance],
      view: new View({ center: fromLonLat([0, 20]), zoom: 1.5 }),
    });

    mapRef.current = instance;
    setMap(instance);
    setOverlay(overlayInstance);

    return () => {
      instance.setTarget(undefined);
      mapRef.current = null;
      setMap(null);
      setOverlay(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { map, overlay };
}

/** Moves the camera to fit the current data whenever the view changes. */
export function useMapView(map: OlMap | null, view: MapView): void {
  useEffect(() => {
    if (!map) {
      return;
    }
    const olView = map.getView();
    if ("bounds" in view) {
      const [[southLat, westLng], [northLat, eastLng]] = view.bounds;
      const extent = [
        ...fromLonLat([westLng, southLat]),
        ...fromLonLat([eastLng, northLat]),
      ] as [number, number, number, number];
      olView.fit(extent, {
        padding: [40, 40, 40, 40],
        maxZoom: 8,
        duration: 300,
      });
    } else {
      olView.animate({
        center: fromLonLat([view.center[1], view.center[0]]),
        zoom: view.zoom,
        duration: 300,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, JSON.stringify(view)]);
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
  return `rgba(${r}, 100, ${b}, 0.85)`;
}

function radiusFor(value: number | undefined, maxValue: number): number {
  if (value === undefined) {
    return 8;
  }
  const normalized = (value / (maxValue || 1)) * 20;
  return Math.max(5, Math.min(25, normalized + 5));
}

/** Renders GoodData location + value (+ optional segment) data as a data-driven point layer. */
export function usePushpinLayer(
  map: OlMap | null,
  overlay: Overlay | null,
  points: PushpinPoint[],
  valueLabel: string,
  visible: boolean
): void {
  const layerRef = useRef<VectorLayer<VectorSource> | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
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

    const features = points.map((point) => {
      const color = point.segment
        ? SEGMENT_PALETTE[
            segmentOrder.indexOf(point.segment) % SEGMENT_PALETTE.length
          ]
        : gradientColor(point.value ?? 0, maxValue);

      const feature = new Feature({
        geometry: new Point(fromLonLat([point.lng, point.lat])),
      });
      feature.setProperties({
        name: point.name,
        value: point.value ?? null,
        segment: point.segment ?? null,
      });
      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: radiusFor(point.value, maxValue),
            fill: new Fill({ color }),
            stroke: new Stroke({ color: "#fff", width: 1.5 }),
          }),
        })
      );
      return feature;
    });

    const layer = new VectorLayer({
      source: new VectorSource({ features }),
      zIndex: 10,
    });
    layerRef.current = layer;
    map.addLayer(layer);

    const onClick = (evt: MapBrowserEvent) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f, {
        layerFilter: (l) => l === layer,
      });
      if (!feature || !overlay?.getElement()) {
        return;
      }
      const { name, value, segment } = feature.getProperties() as {
        name: string;
        value: number | null;
        segment: string | null;
      };
      overlay.getElement()!.innerHTML = `
        <div class="ol-popup-content">
          <strong>${name}</strong>
          ${segment ? `<p>${segment}</p>` : ""}
          ${
            value !== null
              ? `<p>${valueLabel}: <span class="value">${value.toLocaleString()}</span></p>`
              : ""
          }
        </div>
      `;
      overlay.setPosition((feature.getGeometry() as Point).getCoordinates());
    };
    const onPointerMove = (evt: MapBrowserEvent) => {
      const hit = map.hasFeatureAtPixel(evt.pixel, {
        layerFilter: (l) => l === layer,
      });
      map.getViewport().style.cursor = hit ? "pointer" : "";
    };
    map.on("click", onClick);
    map.on("pointermove", onPointerMove);

    return () => {
      map.un("click", onClick);
      map.un("pointermove", onPointerMove);
      map.removeLayer(layer);
      layerRef.current = null;
    };
  }, [map, overlay, points, valueLabel, visible]);
}

/** Renders point data as OpenLayers' native heatmap layer - an alternative to individual points. */
export function useHeatmapLayer(
  map: OlMap | null,
  points: PushpinPoint[],
  visible: boolean
): void {
  const layerRef = useRef<HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
    if (!visible || points.length === 0) {
      return;
    }

    const maxValue = Math.max(1, ...points.map((p) => p.value ?? 0));
    const features = points.map((point) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([point.lng, point.lat])),
      });
      feature.set("weight", (point.value ?? 0) / maxValue);
      return feature;
    });

    const layer = new HeatmapLayer({
      source: new VectorSource({ features }),
      weight: (feature) => feature.get("weight") as number,
      radius: 15,
      blur: 20,
      zIndex: 10,
    });
    layerRef.current = layer;
    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
      layerRef.current = null;
    };
  }, [map, points, visible]);
}

const geoJsonFormat = new GeoJSON();

function fillColor(value: number | null, maxValue: number): string {
  if (value === null) {
    return "rgba(229, 231, 235, 0.4)";
  }
  const normalized = maxValue > 0 ? value / maxValue : 0;
  const lightness = 85 - normalized * 55;
  return `hsl(215, 70%, ${lightness}%)`;
}

/**
 * Renders GoodData `GDC.geo.area` country values as an OpenLayers vector polygon layer - the
 * OpenLayers-native equivalent of sdk-ui-geo's area (choropleth) layer.
 */
export function useAreaChoroplethLayer(
  map: OlMap | null,
  overlay: Overlay | null,
  valueByCode: Record<string, number>,
  maxValue: number,
  valueLabel: string,
  visible: boolean
): void {
  const layerRef = useRef<VectorLayer<VectorSource> | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
    if (!visible) {
      return;
    }

    const features = geoJsonFormat.readFeatures(countryBoundaries, {
      featureProjection: "EPSG:3857",
    });
    features.forEach((feature) => {
      const alpha2 = feature.get("alpha2") as string;
      const value = valueByCode[alpha2] ?? null;
      feature.set("value", value);
      feature.setStyle(
        new Style({
          fill: new Fill({ color: fillColor(value, maxValue) }),
          stroke: new Stroke({ color: "#475569", width: 1 }),
        })
      );
    });

    const layer = new VectorLayer({
      source: new VectorSource({ features }),
      zIndex: 1,
    });
    layerRef.current = layer;
    map.addLayer(layer);

    const onClick = (evt: MapBrowserEvent) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f, {
        layerFilter: (l) => l === layer,
      });
      if (!feature || !overlay?.getElement()) {
        return;
      }
      const name = feature.get("name") as string;
      const value = feature.get("value") as number | null;
      overlay.getElement()!.innerHTML = `
        <div class="ol-popup-content">
          <strong>${name}</strong>
          ${
            value !== null
              ? `<p>${valueLabel}: <span class="value">${value.toLocaleString()}</span></p>`
              : "<p>No data</p>"
          }
        </div>
      `;
      overlay.setPosition(evt.coordinate);
    };
    map.on("click", onClick);

    return () => {
      map.un("click", onClick);
      map.removeLayer(layer);
      layerRef.current = null;
    };
  }, [map, overlay, valueByCode, maxValue, valueLabel, visible]);
}
