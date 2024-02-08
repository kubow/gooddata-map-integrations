import React from "react";
import { GeoPushpinChart } from "@gooddata/sdk-ui-geo";
import mapboxgl from './mapBoxConfig';
import * as Md from "./catalog.js";

// consult with https://www.gooddata.com/docs/gooddata-ui/latest/references/visual_components/geo_pushpin_chart/

const MapBoxSimple = () => {
    const config = {
        points: {groupNearbyPoints: false},
        tooltipText: Md.CustomerCity.Default,
        viewport: {area: "america_north"},
        separators: {thousand: ",", decimal: "."},
        mapboxToken: mapboxgl.accessToken
    };
    return (
        <div style={{ height: 350, width: 550 }}>
            <GeoPushpinChart
                latitude={Md.CustomerCity.GeoCustomerCityCityPushpinLatitude}
                longitude={Md.CustomerCity.GeoCustomerCityCityPushpinLongitude}
                //location={Md.CustomerCity.location}
                size={Md.OrderAmount}
                color={Md.ActiveCustomers}
                segmentBy={Md.CustomerAge}
                config={config}
            />
        </div>
    );
}
export default MapBoxSimple
