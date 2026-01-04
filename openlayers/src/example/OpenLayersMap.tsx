// (C) 2021-2025 GoodData Corporation
import React, { useEffect, useRef, useMemo } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import type { MapDataPoint } from "./OpenLayersDataLoader.js";

interface OpenLayersMapProps {
  points: MapDataPoint[];
}

/**
 * OpenLayersMap - Displays GoodData data points on an interactive OpenLayers map
 *
 * Features:
 * - Interactive pan and zoom
 * - Circle markers with size based on value
 * - Popup information on click
 * - OpenStreetMap tiles (free, no API key required)
 */
const OpenLayersMap: React.FC<OpenLayersMapProps> = ({ points }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

  // Calculate the center of the map based on data points
  const mapCenter = useMemo(() => {
    if (points.length === 0) {
      // Default to center of US if no points
      return { lat: 39.8283, lng: -98.5795 };
    }

    const sumLat = points.reduce((sum, p) => sum + p.lat, 0);
    const sumLng = points.reduce((sum, p) => sum + p.lng, 0);

    return {
      lat: sumLat / points.length,
      lng: sumLng / points.length,
    };
  }, [points]);

  // Calculate zoom level based on point spread
  const zoomLevel = useMemo(() => {
    if (points.length <= 1) return 4;

    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const latSpread = Math.max(...lats) - Math.min(...lats);
    const lngSpread = Math.max(...lngs) - Math.min(...lngs);
    const maxSpread = Math.max(latSpread, lngSpread);

    if (maxSpread > 100) return 2;
    if (maxSpread > 50) return 3;
    if (maxSpread > 20) return 4;
    if (maxSpread > 10) return 5;
    if (maxSpread > 5) return 6;
    return 8;
  }, [points]);

  // Calculate max value for normalization
  const maxValue = useMemo(() => {
    const values = points
      .filter((p) => p.value !== undefined)
      .map((p) => p.value as number);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [points]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (
    coord1: [number, number],
    coord2: [number, number]
  ): number => {
    const [lat1, lng1] = coord1;
    const [lat2, lng2] = coord2;

    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Count nearby points within a distance threshold
  const countNearbyPoints = (
    point: MapDataPoint,
    threshold: number = 100
  ): number => {
    return points.filter(
      (p) =>
        p !== point &&
        calculateDistance([point.lat, point.lng], [p.lat, p.lng]) <= threshold
    ).length;
  };

  // Get circle radius based on value
  const getCircleRadius = (value?: number): number => {
    if (value === undefined) return 8;
    const normalized = (value / maxValue) * 20;
    return Math.max(5, Math.min(25, normalized + 5));
  };

  // Get color based on value (gradient from blue to red)
  const getColor = (value?: number): string => {
    if (value === undefined) return "rgba(51, 136, 255, 0.8)";
    const normalized = value / maxValue;
    const r = Math.round(255 * normalized);
    const b = Math.round(255 * (1 - normalized));
    return `rgba(${r}, 100, ${b}, 0.8)`;
  };

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    // Create popup overlay
    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
    overlayRef.current = overlay;

    // Create features from points
    const features = points.map((point, index) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([point.lng, point.lat])),
        name: point.name,
        value: point.value,
        lat: point.lat,
        lng: point.lng,
        index: index,
      });

      // Set style for each feature based on its value
      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: getCircleRadius(point.value),
            fill: new Fill({
              color: getColor(point.value),
            }),
            stroke: new Stroke({
              color: "#fff",
              width: 2,
            }),
          }),
        })
      );

      return feature;
    });

    // Create vector source and layer
    const vectorSource = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Create the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([mapCenter.lng, mapCenter.lat]),
        zoom: zoomLevel,
      }),
    });

    mapInstanceRef.current = map;

    // Add click handler for popups
    map.on("click", (evt) => {
      const feature = map.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => feature
      );

      if (feature) {
        const coords = (feature.getGeometry() as Point).getCoordinates();
        const pointData = points[feature.get("index")];
        const nearbyCount = countNearbyPoints(pointData);

        if (popupRef.current) {
          popupRef.current.innerHTML = `
                        <div class="ol-popup-content">
                            <strong>${feature.get("name")}</strong>
                            ${
                              feature.get("value") !== undefined
                                ? `<p>Value: <span class="value">${feature
                                    .get("value")
                                    .toLocaleString()}</span></p>`
                                : ""
                            }
                            <p class="coords">Lat: ${feature
                              .get("lat")
                              .toFixed(4)}, Lng: ${feature
            .get("lng")
            .toFixed(4)}</p>
                            <p class="nearby">Points within 100km: <strong>${nearbyCount}</strong></p>
                        </div>
                    `;
        }

        overlay.setPosition(coords);
      } else {
        overlay.setPosition(undefined);
      }
    });

    // Change cursor on hover
    map.on("pointermove", (evt) => {
      const hit = map.hasFeatureAtPixel(evt.pixel);
      map.getViewport().style.cursor = hit ? "pointer" : "";
    });

    // Cleanup
    return () => {
      map.setTarget(undefined);
    };
  }, [points, mapCenter, zoomLevel, maxValue]);

  if (points.length === 0) {
    return (
      <div className="openlayers-container-wrapper">
        <div className="no-data-message">
          <h3>No Location Data Available</h3>
          <p>
            Configure your GoodData catalog with location attributes
            (latitude/longitude) to see data points on the map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="openlayers-container-wrapper">
      <div ref={mapRef} className="openlayers-container" />
      <div ref={popupRef} className="ol-popup" />
    </div>
  );
};

export default OpenLayersMap;
