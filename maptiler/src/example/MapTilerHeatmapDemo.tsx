// (C) 2021-2025 GoodData Corporation
import React from "react";
import MapTilerMap from "./MapTilerMap.js";
import type { MapDataPoint } from "./MapTilerDataLoader.js";

/**
 * MapTilerHeatmapDemo - Demonstrates the MapTiler heatmap visualization with sample data
 *
 * This component showcases the heatmap layer helper from MapTiler SDK,
 * displaying data density and intensity based on values.
 */
const MapTilerHeatmapDemo: React.FC = () => {
  // Generate denser sample data for better heatmap visualization
  const samplePoints: MapDataPoint[] = [
    // New York area cluster
    { name: "Manhattan", lat: 40.7831, lng: -73.9712, value: 150000 },
    { name: "Brooklyn", lat: 40.6782, lng: -73.9442, value: 120000 },
    { name: "Queens", lat: 40.7282, lng: -73.7949, value: 110000 },
    { name: "Bronx", lat: 40.8448, lng: -73.8648, value: 90000 },
    { name: "Staten Island", lat: 40.5795, lng: -74.1502, value: 60000 },

    // Los Angeles area cluster
    { name: "Downtown LA", lat: 34.0522, lng: -118.2437, value: 140000 },
    { name: "Santa Monica", lat: 34.0195, lng: -118.4912, value: 95000 },
    { name: "Pasadena", lat: 34.1478, lng: -118.1445, value: 75000 },
    { name: "Long Beach", lat: 33.7701, lng: -118.1937, value: 85000 },
    { name: "Glendale", lat: 34.1425, lng: -118.255, value: 70000 },

    // San Francisco Bay Area cluster
    { name: "San Francisco", lat: 37.7749, lng: -122.4194, value: 130000 },
    { name: "Oakland", lat: 37.8044, lng: -122.2712, value: 80000 },
    { name: "San Jose", lat: 37.3382, lng: -121.8863, value: 115000 },
    { name: "Berkeley", lat: 37.8715, lng: -122.273, value: 65000 },
    { name: "Palo Alto", lat: 37.4419, lng: -122.143, value: 90000 },

    // Chicago area cluster
    { name: "Downtown Chicago", lat: 41.8781, lng: -87.6298, value: 125000 },
    { name: "Evanston", lat: 42.0451, lng: -87.6877, value: 70000 },
    { name: "Naperville", lat: 41.7508, lng: -88.1535, value: 60000 },
    { name: "Aurora", lat: 41.7606, lng: -88.3201, value: 55000 },

    // Houston area cluster
    { name: "Houston Downtown", lat: 29.7604, lng: -95.3698, value: 100000 },
    { name: "Sugar Land", lat: 29.6196, lng: -95.6349, value: 65000 },
    { name: "The Woodlands", lat: 30.1658, lng: -95.4613, value: 70000 },

    // Other major cities
    { name: "Miami", lat: 25.7617, lng: -80.1918, value: 95000 },
    { name: "Boston", lat: 42.3601, lng: -71.0589, value: 105000 },
    { name: "Seattle", lat: 47.6062, lng: -122.3321, value: 110000 },
    { name: "Denver", lat: 39.7392, lng: -104.9903, value: 85000 },
    { name: "Phoenix", lat: 33.4484, lng: -112.074, value: 90000 },
    { name: "Atlanta", lat: 33.749, lng: -84.388, value: 95000 },
    { name: "Philadelphia", lat: 39.9526, lng: -75.1652, value: 100000 },
    { name: "Dallas", lat: 32.7767, lng: -96.797, value: 105000 },
    { name: "San Diego", lat: 32.7157, lng: -117.1611, value: 88000 },
  ];

  return <MapTilerMap points={samplePoints} viewMode="heatmap" />;
};

export default MapTilerHeatmapDemo;
