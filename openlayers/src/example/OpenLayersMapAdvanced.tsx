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
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import type { MapDataPoint } from "./OpenLayersDataLoader.js";

interface StateData {
  name: string;
  value: number;
}

interface OpenLayersMapAdvancedProps {
  points: MapDataPoint[];
  stateData?: StateData[];
}

/**
 * OpenLayersMapAdvanced - Displays GoodData data with state polygons and city points
 *
 * Features:
 * - State polygon layer (choropleth) colored by aggregated values
 * - Interactive city points with size based on value
 * - Popup information on click
 * - Multi-layer visualization
 */
const OpenLayersMapAdvanced: React.FC<OpenLayersMapAdvancedProps> = ({ points, stateData = [] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

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

  // Calculate max value for normalization
  const maxValue = useMemo(() => {
    const values = points.filter((p) => p.value !== undefined).map((p) => p.value as number);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [points]);

  // Calculate max state value for choropleth coloring
  const maxStateValue = useMemo(() => {
    if (stateData.length === 0) return 1;
    return Math.max(...stateData.map((s) => s.value));
  }, [stateData]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
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
  const countNearbyPoints = (point: MapDataPoint, threshold: number = 100): number => {
    return points.filter(
      (p) => p !== point && calculateDistance([point.lat, point.lng], [p.lat, p.lng]) <= threshold
    ).length;
  };

  // Get circle radius based on value
  const getCircleRadius = (value?: number): number => {
    if (value === undefined) return 8;
    const normalized = (value / maxValue) * 20;
    return Math.max(5, Math.min(25, normalized + 5));
  };

  // Get color based on value (gradient from blue to red)
  const getPointColor = (value?: number): string => {
    if (value === undefined) return "rgba(51, 136, 255, 0.8)";
    const normalized = value / maxValue;
    const r = Math.round(255 * normalized);
    const b = Math.round(255 * (1 - normalized));
    return `rgba(${r}, 100, ${b}, 0.8)`;
  };

  // Get state polygon color (choropleth)
  const getStateColor = (value: number): string => {
    const normalized = value / maxStateValue;
    const intensity = Math.round(255 * (1 - normalized * 0.7)); // Lighter colors
    return `rgba(${255 - intensity}, ${200 - intensity * 0.5}, ${255}, 0.4)`;
  };

  // Get state stroke color
  const getStateStrokeColor = (value: number): string => {
    const normalized = value / maxStateValue;
    const intensity = Math.round(200 * normalized);
    return `rgba(${intensity}, 50, ${200 - intensity}, 0.8)`;
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

    // Load US states GeoJSON
    const stateLayer = new VectorLayer({
      source: new VectorSource({
        url: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
        format: new GeoJSON({
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }),
      }),
      style: (feature) => {
        const stateName = feature.get("name");
        const stateInfo = stateData.find((s) => s.name === stateName);
        const value = stateInfo?.value || 0;

        return new Style({
          fill: new Fill({
            color: getStateColor(value),
          }),
          stroke: new Stroke({
            color: getStateStrokeColor(value),
            width: 2,
          }),
        });
      },
      opacity: 0.6,
    });

    // Alternative: Use simpler US states GeoJSON from external source
    fetch("https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json")
      .then((response) => response.json())
      .then((geojsonData) => {
        const features = new GeoJSON({
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }).readFeatures(geojsonData);

        // Style features based on state data
        const styledFeatures = features.map((feature) => {
          const stateName = feature.get("name");
          const stateInfo = stateData.find((s) => {
            // Try to match state name (handle variations)
            return (
              s.name === stateName ||
              s.name.toLowerCase() === stateName?.toLowerCase() ||
              s.name.toLowerCase().includes(stateName?.toLowerCase() || "") ||
              stateName?.toLowerCase().includes(s.name.toLowerCase())
            );
          });
          const value = stateInfo?.value || 0;

          feature.set("value", value);
          feature.set("stateName", stateName);

          feature.setStyle(
            new Style({
              fill: new Fill({
                color: getStateColor(value),
              }),
              stroke: new Stroke({
                color: getStateStrokeColor(value),
                width: 2,
              }),
            })
          );

          return feature;
        });

        stateLayer.getSource()?.addFeatures(styledFeatures);
      })
      .catch((error) => {
        console.error("Error loading state boundaries:", error);
      });

    // Create point features from GoodData data
    const pointFeatures = points.map((point, index) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([point.lng, point.lat])),
        name: point.name,
        value: point.value,
        lat: point.lat,
        lng: point.lng,
        index: index,
      });

      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: getCircleRadius(point.value),
            fill: new Fill({
              color: getPointColor(point.value),
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

    const pointSource = new VectorSource({
      features: pointFeatures,
    });

    const pointLayer = new VectorLayer({
      source: pointSource,
      zIndex: 10, // Ensure points are above states
    });

    // Create the map with layers ordered: base map, states, points
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        stateLayer, // State polygons beneath
        pointLayer, // Points on top
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
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature, {
        layerFilter: (layer) => layer === pointLayer, // Only click on points, not states
      });

      if (feature && feature.get("index") !== undefined) {
        const coords = (feature.getGeometry() as Point).getCoordinates();
        const pointData = points[feature.get("index")];
        const nearbyCount = countNearbyPoints(pointData);

        if (popupRef.current) {
          popupRef.current.innerHTML = `
            <div class="ol-popup-content">
              <strong>${feature.get("name")}</strong>
              ${
                feature.get("value") !== undefined
                  ? `<p>Value: <span class="value">${feature.get("value").toLocaleString()}</span></p>`
                  : ""
              }
              <p class="coords">Lat: ${feature.get("lat").toFixed(4)}, Lng: ${feature.get("lng").toFixed(4)}</p>
              <p class="nearby">Points within 100km: <strong>${nearbyCount}</strong></p>
            </div>
          `;
        }

        overlay.setPosition(coords);
      } else {
        overlay.setPosition(undefined);
      }
    });

    // Change cursor on hover (points only)
    map.on("pointermove", (evt) => {
      const hit = map.hasFeatureAtPixel(evt.pixel, {
        layerFilter: (layer) => layer === pointLayer,
      });
      map.getViewport().style.cursor = hit ? "pointer" : "";
    });

    // Cleanup
    return () => {
      map.setTarget(undefined);
    };
  }, [points, stateData, mapCenter, zoomLevel, maxValue, maxStateValue]);

  if (points.length === 0) {
    return (
      <div className="openlayers-container-wrapper">
        <div className="no-data-message">
          <h3>No Location Data Available</h3>
          <p>
            Configure your GoodData catalog with location attributes (latitude/longitude) to see data
            points on the map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="openlayers-container-wrapper">
      <div ref={mapRef} className="openlayers-container" />
      <div ref={popupRef} className="ol-popup" />
      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "rgba(51, 136, 255, 0.8)" }}></div>
          <span>Cities (size = value)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "rgba(200, 200, 255, 0.4)" }}></div>
          <span>States (color = total value)</span>
        </div>
      </div>
    </div>
  );
};

export default OpenLayersMapAdvanced;

