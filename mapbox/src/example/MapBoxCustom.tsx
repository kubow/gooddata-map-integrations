import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";

// inspiration https://github.com/mapbox/mapbox-react-examples

// Set the MapBox access token from environment variable
// @ts-ignore - mapbox-gl types don't include accessToken but it exists at runtime
mapboxgl.accessToken = (import.meta as any).env.VITE_MAPBOX_TOKEN;

const MapBoxCustom = ({ result }: { result: any }) => {
  const slices = result.data().slices().toArray();

  // Extract map points from slices
  // Slice titles contain: [cityName, latitude, longitude] from the 3 display forms
  // Data points contain the measure value (e.g., TotalCustomers)
  const customPoints = slices.map((slice: any) => {
    const titles = slice.sliceTitles();
    const dataPoints = slice.dataPoints();

    // Get city name from first display form (index 0)
    const name = titles[0] || "Unknown";

    // Get lat/lng from the geo display forms (indices 1 and 2)
    const lat = parseFloat(titles[1]) || 0;
    const lng = parseFloat(titles[2]) || 0;

    // Get the measure value (e.g., customer count) for sizing/tooltips
    const value = dataPoints[0]?.rawValue || 0;

    return {
      name,
      lat,
      lng,
      value,
      lngLat: [lng, lat] as [number, number], // MapBox expects [lng, lat] order
    };
  }).filter((point: any) => point.lat !== 0 && point.lng !== 0); // Filter out invalid coords

  console.log("Map points:", customPoints);

  useEffect(() => {
    if (!customPoints.length) return;

    const map = new mapboxgl.Map({
      container: "mapbox-container", // Replace with your map container ID
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.0, 40.75], // Replace with your map center
      zoom: 3, // Replace with your map zoom
    });

    // Add layer for points from GoodData's semantic layer
    map.on("load", () => {
      map.addSource("custom-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: customPoints.map((point, index) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: point.lngLat,
            },
            properties: {
              title: point.name,
              index,
            },
          })),
        },
      });

      map.addLayer({
        id: "custom-points-layer",
        type: "circle",
        source: "custom-points",
        paint: {
          "circle-radius": 8,
          "circle-color": "#ff0000",
        },
      });

      // Create a popup, but don't add it to the map yet
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false });

      // Add click event listener for the points layer
      map.on("click", "custom-points-layer", (e) => {
        const index = e.features[0].properties.index;
        const clickedPoint = customPoints[index];

        // Find the number of other customPoints within a certain distance
        const distanceThreshold = 100; // Define your distance threshold in kilometers
        const nearbyPoints = customPoints.filter(
          (point, i) =>
            i !== index &&
            calculateDistance(clickedPoint.lngLat, point.lngLat) <=
              distanceThreshold
        );

        // Perform reverse geocoding
        const [lng, lat] = clickedPoint.lngLat;
        const locationDetails = performReverseGeocoding(lat, lng).then(
          (locationDetails) => {
            // Set the popup coordinates based on the clicked point
            popup
              .setLngLat(clickedPoint.lngLat)
              .setHTML(
                `<p>
                  <b>${clickedPoint.name}</b><br/>
                  ${locationDetails}<br/>
                  Number of resellers within ${distanceThreshold} km area: ${nearbyPoints.length}
                </p>`
              )
              .addTo(map);
          }
        );

        // Set the popup coordinates based on the clicked point
        popup
          .setLngLat(clickedPoint.lngLat)
          .setHTML(
            `
              <p>${clickedPoint.name}</p>
              <p>${locationDetails}</p>
              <p>Number of points within ${distanceThreshold} km: ${nearbyPoints.length}</p>
            `
          )
          .addTo(map);
      });

      // Change the cursor to a pointer when the mouse is over the points layer
      map.on("mouseenter", "custom-points-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to the default when it leaves
      map.on("mouseleave", "custom-points-layer", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    // Clean up the map when the component is unmounted
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []); // Run only once when the component mounts

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (coord1, coord2) => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  // Function to perform reverse geocoding using Mapbox Geocoding API
  const performReverseGeocoding = (lat: string, lng: string) => {
    try {
      console.log("API fetching " + lng + "/" + lat);
      return fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${(mapboxgl as any).accessToken}`
      )
        .then((response) => response.json())
        .then((result) => {
          const locationDetails = `Geocoded details: <i>${result.features[0].place_name}</i>`;
          console.log(result);
          return locationDetails;
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="mapbox-container" style={{ width: "100%", height: "50vh" }} />
  );
};

export default MapBoxCustom;
