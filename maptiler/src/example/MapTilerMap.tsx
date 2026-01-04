// (C) 2021-2025 GoodData Corporation
import React, { useEffect, useRef, useMemo } from "react";
import * as maptilersdk from "@maptiler/sdk";
import type { MapDataPoint } from "./MapTilerDataLoader.js";

// Import MapTiler SDK styles
import "@maptiler/sdk/dist/maptiler-sdk.css";

interface MapTilerMapProps {
  points: MapDataPoint[];
  viewMode: "markers" | "heatmap";
}

/**
 * MapTilerMap - Displays GoodData data points on an interactive MapTiler map
 *
 * Features:
 * - Interactive markers with popups
 * - Heatmap visualization
 * - Dynamic marker sizing and coloring based on values
 * - Navigation controls
 */
const MapTilerMap: React.FC<MapTilerMapProps> = ({ points, viewMode }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);

  // Configure MapTiler API key
  maptilersdk.config.apiKey = (import.meta as any).env.VITE_MAPTILER_TOKEN;

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

  // Get marker color based on value (gradient from blue to red)
  const getMarkerColor = (value?: number): string => {
    if (value === undefined) return "#3388ff";
    const normalized = value / maxValue;
    const r = Math.round(255 * normalized);
    const b = Math.round(255 * (1 - normalized));
    const g = 100;
    return `rgb(${r}, ${g}, ${b})`;
  };

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

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize the map
    const map = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [mapCenter.lng, mapCenter.lat],
      zoom: zoomLevel,
    });

    mapRef.current = map;

    // Add navigation controls
    map.on("load", () => {
      map.addControl(new maptilersdk.NavigationControl(), "top-right");
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map view when points change
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [mapCenter.lng, mapCenter.lat],
      zoom: zoomLevel,
      essential: true,
    });
  }, [mapCenter, zoomLevel]);

  // Update markers or heatmap based on view mode
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Wait for map to be loaded
    if (!map.loaded()) {
      map.on("load", () => updateVisualization());
    } else {
      updateVisualization();
    }

    function updateVisualization() {
      if (!mapRef.current) return;
      const map = mapRef.current;

      // Remove existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Remove existing heatmap layer if exists
      if (map.getLayer("heatmap-layer")) {
        map.removeLayer("heatmap-layer");
      }
      if (map.getSource("heatmap-source")) {
        map.removeSource("heatmap-source");
      }

      if (viewMode === "markers") {
        // Add markers with popups
        points.forEach((point) => {
          const nearbyCount = countNearbyPoints(point);

          const marker = new maptilersdk.Marker({
            color: getMarkerColor(point.value),
          })
            .setLngLat([point.lng, point.lat])
            .addTo(map);

          const popupContent = `
            <div class="maptiler-popup">
              <strong>${point.name}</strong>
              ${
                point.value !== undefined
                  ? `<p>Value: <span class="value">${point.value.toLocaleString()}</span></p>`
                  : ""
              }
              <p class="coords">Lat: ${point.lat.toFixed(
                4
              )}, Lng: ${point.lng.toFixed(4)}</p>
              <p class="nearby">Points within 100km: <strong>${nearbyCount}</strong></p>
            </div>
          `;

          const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(
            popupContent
          );
          marker.setPopup(popup);

          markersRef.current.push(marker);
        });
      } else {
        // Add heatmap layer using MapTiler SDK
        // Create GeoJSON from points
        const geojsonData: any = {
          type: "FeatureCollection",
          features: points.map((point) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [point.lng, point.lat],
            },
            properties: {
              value: point.value || 0,
              name: point.name,
            },
          })),
        };

        map.addSource("heatmap-source", {
          type: "geojson",
          data: geojsonData,
        });

        map.addLayer({
          id: "heatmap-layer",
          type: "heatmap",
          source: "heatmap-source",
          paint: {
            // Increase the heatmap weight based on value property
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "value"],
              0,
              0,
              maxValue,
              1,
            ],
            // Increase the heatmap color intensity by zoom level
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              9,
              3,
            ],
            // Color ramp for heatmap
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
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              2,
              9,
              20,
            ],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              1,
              9,
              0,
            ],
          },
        });

        // Add a circle layer on top for individual points at high zoom
        map.addLayer({
          id: "heatmap-point",
          type: "circle",
          source: "heatmap-source",
          paint: {
            // Size circle radius by value
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "value"],
              0,
              5,
              maxValue,
              20,
            ],
            // Color circles by value
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
            // Transition from heatmap to circle layer by zoom level
            "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
          },
        });

        // Add click event for heatmap points
        map.on("click", "heatmap-point", (e) => {
          if (!e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const coordinates = (feature.geometry as any).coordinates.slice();
          const { name, value } = feature.properties || {};

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new maptilersdk.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `
              <div class="maptiler-popup">
                <strong>${name}</strong>
                <p>Value: <span class="value">${value?.toLocaleString()}</span></p>
              </div>
            `
            )
            .addTo(map);
        });

        // Change the cursor to a pointer when hovering over points
        map.on("mouseenter", "heatmap-point", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "heatmap-point", () => {
          map.getCanvas().style.cursor = "";
        });
      }
    }
  }, [points, viewMode, maxValue]);

  if (points.length === 0) {
    return (
      <div className="maptiler-container-wrapper">
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
    <div className="maptiler-container-wrapper">
      <div
        ref={mapContainerRef}
        className="maptiler-container"
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
};

export default MapTilerMap;
