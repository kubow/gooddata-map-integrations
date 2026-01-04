// (C) 2021-2025 GoodData Corporation
import React, { useEffect, useRef, useMemo } from "react";
import * as maptilersdk from "@maptiler/sdk";
import type { MapDataPoint } from "./MapTilerDataLoaderAdvanced.js";

// Import MapTiler SDK styles
import "@maptiler/sdk/dist/maptiler-sdk.css";

interface StateData {
  name: string;
  metrics: {
    totalCustomers?: number;
    activeCustomers?: number;
    newCustomers?: number;
  };
}

interface MapTilerMapAdvancedProps {
  points: MapDataPoint[];
  stateData?: StateData[];
}

/**
 * MapTilerMapAdvanced - Displays GoodData data with state polygons and city points
 * Inspired by: https://docs.maptiler.com/sdk-js/examples/polygon-popup-on-click/
 *
 * Features:
 * - State polygon layer (choropleth) colored by aggregated values
 * - Interactive city points with size based on value
 * - Popup information on click for both polygons and points
 * - Multiple metrics support
 * - Multi-layer visualization
 */
const MapTilerMapAdvanced: React.FC<MapTilerMapAdvancedProps> = ({
  points,
  stateData = [],
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Configure MapTiler API key
  (maptilersdk as any).config.apiKey = (import.meta as any).env.VITE_MAPTILER_TOKEN;

  // Calculate the center of the map based on data points
  const mapCenter = useMemo(() => {
    if (points.length === 0) {
      return { lat: 39.8283, lng: -98.5795 }; // Center of US
    }

    const sumLat = points.reduce((sum, p) => sum + p.lat, 0);
    const sumLng = points.reduce((sum, p) => sum + p.lng, 0);

    return {
      lat: sumLat / points.length,
      lng: sumLng / points.length,
    };
  }, [points]);

  // Calculate zoom level
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
    return 6;
  }, [points]);

  // Calculate max values for normalization
  const maxTotalCustomers = useMemo(() => {
    const values = points
      .filter((p) => p.metrics.totalCustomers !== undefined)
      .map((p) => p.metrics.totalCustomers as number);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [points]);

  const maxStateTotalCustomers = useMemo(() => {
    if (stateData.length === 0) return 1;
    return Math.max(...stateData.map((s) => s.metrics.totalCustomers || 0));
  }, [stateData]);

  // Get marker color based on value (gradient from blue to red)
  const getMarkerColor = (value?: number): string => {
    if (value === undefined) return "#3388ff";
    const normalized = value / maxTotalCustomers;
    const r = Math.round(255 * normalized);
    const b = Math.round(255 * (1 - normalized));
    return `rgb(${r}, 100, ${b})`;
  };


  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new (maptilersdk as any).Map({
      container: mapContainerRef.current,
      style: (maptilersdk as any).MapStyle.STREETS,
      center: [mapCenter.lng, mapCenter.lat],
      zoom: zoomLevel,
    });

    mapRef.current = map;

    // Add navigation controls
    map.on("load", () => {
      map.addControl(new (maptilersdk as any).NavigationControl(), "top-right");
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

  // Add state polygons and city points
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

      // Remove existing layers and sources
      ["state-fill", "state-outline", "city-points"].forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      });

      ["us-states", "city-points-source"].forEach((sourceId) => {
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      });

      // Add US states GeoJSON layer (similar to MapTiler polygon example)
      fetch(
        "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json"
      )
        .then((response) => response.json())
        .then((geojsonData) => {
          // Enrich GeoJSON with GoodData metrics
          const enrichedFeatures = geojsonData.features.map(
            (feature: any) => {
              const stateName = feature.properties.name;
              const stateInfo = stateData.find((s) => {
                // Try to match state name (handle variations)
                return (
                  s.name === stateName ||
                  s.name.toLowerCase() === stateName?.toLowerCase() ||
                  s.name.toLowerCase().includes(stateName?.toLowerCase() || "") ||
                  stateName?.toLowerCase().includes(s.name.toLowerCase())
                );
              });

              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  totalCustomers: stateInfo?.metrics.totalCustomers || 0,
                  activeCustomers: stateInfo?.metrics.activeCustomers || 0,
                  newCustomers: stateInfo?.metrics.newCustomers || 0,
                },
              };
            }
          );

          map.addSource("us-states", {
            type: "geojson",
            data: {
              ...geojsonData,
              features: enrichedFeatures,
            },
          });

          // Add fill layer for states (choropleth)
          map.addLayer({
            id: "state-fill",
            type: "fill",
            source: "us-states",
            paint: {
              "fill-color": [
                "case",
                ["!=", ["get", "totalCustomers"], 0],
                [
                  "interpolate",
                  ["linear"],
                  ["get", "totalCustomers"],
                  0,
                  "rgba(200, 200, 255, 0.1)",
                  maxStateTotalCustomers / 2,
                  "rgba(150, 150, 255, 0.4)",
                  maxStateTotalCustomers,
                  "rgba(100, 100, 255, 0.6)",
                ],
                "rgba(220, 220, 220, 0.1)",
              ],
              "fill-opacity": 0.6,
            },
          });

          // Add outline layer for states
          map.addLayer({
            id: "state-outline",
            type: "line",
            source: "us-states",
            paint: {
              "line-color": [
                "case",
                ["!=", ["get", "totalCustomers"], 0],
                [
                  "interpolate",
                  ["linear"],
                  ["get", "totalCustomers"],
                  0,
                  "rgba(100, 100, 200, 0.5)",
                  maxStateTotalCustomers,
                  "rgba(50, 50, 150, 0.8)",
                ],
                "rgba(200, 200, 200, 0.5)",
              ],
              "line-width": 2,
            },
          });

          // Add click event for state polygons
          map.on("click", "state-fill", (e: any) => {
            if (!e.features || e.features.length === 0) return;

            const feature = e.features[0];
            const { name, totalCustomers, activeCustomers, newCustomers } =
              feature.properties;

            new (maptilersdk as any).Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                `
                <div class="maptiler-popup state-popup">
                  <h3>${name}</h3>
                  <table>
                    <tr>
                      <td>Total Customers:</td>
                      <td><strong>${totalCustomers?.toLocaleString() || 0}</strong></td>
                    </tr>
                    <tr>
                      <td>Active Customers:</td>
                      <td><strong>${activeCustomers?.toLocaleString() || 0}</strong></td>
                    </tr>
                    <tr>
                      <td>New Customers:</td>
                      <td><strong>${newCustomers?.toLocaleString() || 0}</strong></td>
                    </tr>
                  </table>
                </div>
              `
              )
              .addTo(map);
          });

          // Change cursor on hover
          map.on("mouseenter", "state-fill", () => {
            map.getCanvas().style.cursor = "pointer";
          });

          map.on("mouseleave", "state-fill", () => {
            map.getCanvas().style.cursor = "";
          });
        })
        .catch((error) => {
          console.error("Error loading state boundaries:", error);
        });

      // Add city points as markers (on top of states)
      points.forEach((point) => {
        const marker = new (maptilersdk as any).Marker({
          color: getMarkerColor(point.metrics.totalCustomers),
        })
          .setLngLat([point.lng, point.lat])
          .addTo(map);

        const popupContent = `
          <div class="maptiler-popup city-popup">
            <h3>${point.name}</h3>
            <table>
              <tr>
                <td>Total Customers:</td>
                <td><strong>${point.metrics.totalCustomers?.toLocaleString() || "N/A"}</strong></td>
              </tr>
              <tr>
                <td>Active Customers:</td>
                <td><strong>${point.metrics.activeCustomers?.toLocaleString() || "N/A"}</strong></td>
              </tr>
              <tr>
                <td>New Customers:</td>
                <td><strong>${point.metrics.newCustomers?.toLocaleString() || "N/A"}</strong></td>
              </tr>
            </table>
            <p class="coords">Lat: ${point.lat.toFixed(4)}, Lng: ${point.lng.toFixed(4)}</p>
          </div>
        `;

        const popup = new (maptilersdk as any).Popup({ offset: 25 }).setHTML(
          popupContent
        );
        marker.setPopup(popup);

        markersRef.current.push(marker);
      });
    }
  }, [points, stateData, maxTotalCustomers, maxStateTotalCustomers]);

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
      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <div
            className="legend-marker"
            style={{ backgroundColor: "#3388ff" }}
          ></div>
          <span>Cities (colored by Total Customers)</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "rgba(200, 200, 255, 0.4)" }}
          ></div>
          <span>States (shaded by Total Customers)</span>
        </div>
      </div>
    </div>
  );
};

export default MapTilerMapAdvanced;

