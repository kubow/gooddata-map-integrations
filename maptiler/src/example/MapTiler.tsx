// (C) 2024 GoodData Corporation
import * as maptilersdk from '@maptiler/sdk';
import * as React from "react";

/*
import * as Catalog from "../catalog.js";
*/

const MapTilerComponent = () => {

    // Create a ref to hold the map container div
    const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
    const mapRef = React.useRef<maptilersdk.Map | null>(null);
    const points : Point[] = [
        { longitude: -74.006, latitude: 40.7128, label: "New York" },
        { longitude: -118.2437, latitude: 34.0522, label: "Los Angeles" },
        { longitude: -87.6298, latitude: 41.8781, label: "Chicago" },
    ];    
    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_TOKEN;

    
    React.useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            // Instantiate the map and store it in the ref
            mapRef.current = new maptilersdk.Map({
                container: mapContainerRef.current,
                style: maptilersdk.MapStyle.OUTDOOR, // STREETS 
                center: [0, 0], // Default map center (longitude, latitude)
                zoom: 2,       // Default zoom level
            });

            points.forEach((point) => {
                if (mapRef.current) {
                    const marker = new maptilersdk.Marker({ color: "blue" })
                        .setLngLat([point.longitude, point.latitude])
                        .addTo(mapRef.current);
    
                    const popup = new maptilersdk.Popup({ offset: 25 }).setText(point.label);
                    marker.setPopup(popup);
                }
            });
    
            if (mapRef.current) {
                mapRef.current.addControl(new maptilersdk.NavigationControl());
            }

        }

        // Cleanup function to remove the map when the component unmounts
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    return (
        <>  
            <h2>MapTiler service example</h2>
            <div
                id="map-container"
                ref={mapContainerRef} // Attach the ref to this div
                style={{ width: "100%", height: "400px" }} // Set dimensions for the map
            ></div>
        </>
    );
};

export default MapTilerComponent;
