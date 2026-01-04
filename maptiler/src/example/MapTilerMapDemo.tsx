// (C) 2021-2025 GoodData Corporation
import React from "react";
import MapTilerMap from "./MapTilerMap.js";
import type { MapDataPoint } from "./MapTilerDataLoader.js";

/**
 * MapTilerMapDemo - Demonstrates the MapTiler map with sample data
 *
 * This component provides sample location data to showcase the map visualization
 * with markers and popups without requiring a live GoodData connection.
 */
const MapTilerMapDemo: React.FC = () => {
  // Sample data representing typical GoodData location output
  const samplePoints: MapDataPoint[] = [
    {
      name: "New York - High Sales",
      lat: 40.7128,
      lng: -74.006,
      value: 950000,
    },
    {
      name: "Los Angeles - West Coast Hub",
      lat: 34.0522,
      lng: -118.2437,
      value: 720000,
    },
    {
      name: "Chicago - Midwest Center",
      lat: 41.8781,
      lng: -87.6298,
      value: 580000,
    },
    {
      name: "Houston - Southern Region",
      lat: 29.7604,
      lng: -95.3698,
      value: 450000,
    },
    {
      name: "Phoenix - Growing Market",
      lat: 33.4484,
      lng: -112.074,
      value: 380000,
    },
    {
      name: "Philadelphia - East Coast",
      lat: 39.9526,
      lng: -75.1652,
      value: 420000,
    },
    {
      name: "San Antonio - Texas Region",
      lat: 29.4241,
      lng: -98.4936,
      value: 280000,
    },
    {
      name: "San Diego - Pacific Region",
      lat: 32.7157,
      lng: -117.1611,
      value: 350000,
    },
    {
      name: "Dallas - Central Texas",
      lat: 32.7767,
      lng: -96.797,
      value: 520000,
    },
    {
      name: "San Jose - Tech Hub",
      lat: 37.3382,
      lng: -121.8863,
      value: 680000,
    },
    {
      name: "Austin - Emerging Market",
      lat: 30.2672,
      lng: -97.7431,
      value: 410000,
    },
    {
      name: "Seattle - Pacific Northwest",
      lat: 47.6062,
      lng: -122.3321,
      value: 590000,
    },
    {
      name: "Denver - Mountain Region",
      lat: 39.7392,
      lng: -104.9903,
      value: 340000,
    },
    {
      name: "Boston - Northeast Hub",
      lat: 42.3601,
      lng: -71.0589,
      value: 470000,
    },
    {
      name: "Miami - Southeast Region",
      lat: 25.7617,
      lng: -80.1918,
      value: 390000,
    },
  ];

  return <MapTilerMap points={samplePoints} viewMode="markers" />;
};

export default MapTilerMapDemo;
