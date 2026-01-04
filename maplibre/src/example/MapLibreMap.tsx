// (C) 2021-2025 GoodData Corporation
import React, { useEffect, useRef, useMemo } from "react";
import maplibregl from "maplibre-gl";
import type { MapDataPoint } from "./MapLibreDataLoader.js";

// Import MapLibre styles
import "maplibre-gl/dist/maplibre-gl.css";

interface MapLibreMapProps {
  points: MapDataPoint[];
  viewMode: "markers" | "heatmap";
}

/**
 * MapLibreMap - Displays GoodData data points on an interactive MapLibre GL map
 *
 * Features:
 * - Interactive markers with popups
 * - Heatmap visualization
 * - Dynamic marker sizing and coloring based on values
 * - Navigation controls
 * - No API key required (uses free OpenStreetMap tiles)
 */
const MapLibreMap: React.FC<MapLibreMapProps> = ({ points, viewMode }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

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

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize the map using free OpenStreetMap tiles
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [mapCenter.lng, mapCenter.lat],
      zoom: zoomLevel,
    });

    mapRef.current = map;

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(new maplibregl.ScaleControl(), "bottom-left");

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
      if (map.getLayer("heatmap-point")) {
        map.removeLayer("heatmap-point");
      }
      if (map.getSource("heatmap-source")) {
        map.removeSource("heatmap-source");
      }

      if (viewMode === "markers") {
        // Add markers with popups
        points.forEach((point) => {
          // Create marker element with custom color
          const el = document.createElement("div");
          el.className = "maplibre-marker";
          el.style.backgroundColor = getMarkerColor(point.value);
          el.style.width = "20px";
          el.style.height = "20px";
          el.style.borderRadius = "50%";
          el.style.border = "2px solid white";
          el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
          el.style.cursor = "pointer";

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([point.lng, point.lat])
            .addTo(map);

          const popupContent = `
            <div class="maplibre-popup">
              <strong>${point.name}</strong>
              ${
                point.value !== undefined
                  ? `<p>Value: <span class="value">${point.value.toLocaleString()}</span></p>`
                  : ""
              }
              <p class="coords">Lat: ${point.lat.toFixed(
                4
              )}, Lng: ${point.lng.toFixed(4)}</p>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
            popupContent
          );
          marker.setPopup(popup);

          markersRef.current.push(marker);
        });
      } else {
        // Add heatmap layer
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

          new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `
              <div class="maplibre-popup">
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
      <div className="maplibre-container-wrapper">
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
    <div className="maplibre-container-wrapper">
      <div
        ref={mapContainerRef}
        className="maplibre-container"
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
};

export default MapLibreMap;

