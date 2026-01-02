// (C) 2021 - 2025 GoodData Corporation
import React from "react";
import { GeoPushpinChart } from "@gooddata/sdk-ui-geo";

// https://gdui-examples.herokuapp.com/geo-pushpin-chart
// https://www.gooddata.com/docs/gooddata-ui/latest/references/visual_components/geo_pushpin_chart/

import * as Md from "../catalog.js";

const GoodMapComponent: React.FC = () => {
  const config = {
    points: { groupNearbyPoints: false },
    tooltipText: Md.CustomerAge,
    viewport: { area: "continent_na" as const },
    separators: { thousand: ",", decimal: "." },
    mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN,
  };
  const onLoadingChanged = () => {
    // handle the callback here
  };
  const onError = () => {
    // handle the callback here
  };
  const onZoomChanged = () => {
    // handle the callback here
  };
  const onCenterPositionChanged = () => {
    // handle the callback here
  };
  return (
    <>
      <div style={{ height: 350, width: 550 }}>
        <GeoPushpinChart
          latitude={Md.CustomerCity.CityPushpinLatitude}
          longitude={Md.CustomerCity.CityPushpinLongitude}
          //location={Md.Location.Default}
          size={Md.TotalSales}
          color={Md.AverageProductCost}
          //segmentBy={Md.NumberOfCustomers.Avg}
          config={config}
          onZoomChanged={onZoomChanged}
          onCenterPositionChanged={onCenterPositionChanged}
          onLoadingChanged={onLoadingChanged}
          onError={onError}
        />
      </div>
    </>
  );
};

export default GoodMapComponent;
