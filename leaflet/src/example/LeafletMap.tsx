// (C) 2021-2025 GoodData Corporation
import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import type { MapDataPoint } from "./LeafletDataLoader.js";

// Fix for default marker icons in Leaflet with bundlers
// Leaflet's default icons break with webpack/vite because of URL handling
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Configure default icon
const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
    points: MapDataPoint[];
}

/**
 * LeafletMap - Displays GoodData data points on an interactive Leaflet map
 *
 * Features:
 * - Interactive pan and zoom
 * - Circle markers with size based on value
 * - Popup information on click
 * - OpenStreetMap tiles (free, no API key required)
 */
const LeafletMap: React.FC<LeafletMapProps> = ({ points }) => {
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
        const values = points.filter((p) => p.value !== undefined).map((p) => p.value as number);
        return values.length > 0 ? Math.max(...values) : 1;
    }, [points]);

    // Get circle radius based on value
    const getCircleRadius = (value?: number): number => {
        if (value === undefined) return 8;
        const normalized = (value / maxValue) * 20;
        return Math.max(5, Math.min(25, normalized + 5));
    };

    // Get color based on value (gradient from blue to red)
    const getColor = (value?: number): string => {
        if (value === undefined) return "#3388ff";
        const normalized = value / maxValue;
        const r = Math.round(255 * normalized);
        const b = Math.round(255 * (1 - normalized));
        return `rgb(${r}, 100, ${b})`;
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
    const countNearbyPoints = (point: MapDataPoint, threshold: number = 100): number => {
        return points.filter(
            (p) =>
                p !== point &&
                calculateDistance([point.lat, point.lng], [p.lat, p.lng]) <= threshold
        ).length;
    };

    if (points.length === 0) {
        return (
            <div className="leaflet-container-wrapper">
                <div className="no-data-message">
                    <h3>No Location Data Available</h3>
                    <p>
                        Configure your GoodData catalog with location attributes (latitude/longitude) to
                        see data points on the map.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="leaflet-container-wrapper">
            <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={zoomLevel}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                {/* OpenStreetMap tiles - free and no API key required */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render data points from GoodData */}
                {points.map((point, index) => {
                    const nearbyCount = countNearbyPoints(point);

                    return (
                        <CircleMarker
                            key={`${point.name}-${index}`}
                            center={[point.lat, point.lng]}
                            radius={getCircleRadius(point.value)}
                            pathOptions={{
                                color: getColor(point.value),
                                fillColor: getColor(point.value),
                                fillOpacity: 0.7,
                                weight: 2,
                            }}
                        >
                            <Popup>
                                <div className="marker-popup">
                                    <strong>{point.name}</strong>
                                    {point.value !== undefined && (
                                        <p>
                                            Value:{" "}
                                            <span className="value">{point.value.toLocaleString()}</span>
                                        </p>
                                    )}
                                    <p className="coords">
                                        Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}
                                    </p>
                                    <p className="nearby">
                                        Points within 100km: <strong>{nearbyCount}</strong>
                                    </p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
