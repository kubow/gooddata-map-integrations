// (C) 2021 GoodData Corporation
import React from "react";
import { GeoPushpinChart } from "@gooddata/sdk-ui-geo";

import * as Md from "../catalog.js";

const GoodMapComponent = () => {
  const config = {
    points: { groupNearbyPoints: false },
    tooltipText: Md.ActiveCustomers,
    viewport: { area: "america_north" },
    separators: { thousand: ",", decimal: "." },
    mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN,
  };
  return (
    <>
      <div style={{ height: 350, width: 550 }}>
        <GeoPushpinChart
          latitude={Md.Location.Lat}
          longitude={Md.Location.Lon}
          //location={Md.Location.Default}
          size={Md.Threshold90Percent}
          //color={Md.NumberOfCustomers.Avg}
          //segmentBy={Md.NumberOfCustomers.Avg}
          config={config}
        />
      </div>
    </>
  );
};

export default GoodMapComponent;
