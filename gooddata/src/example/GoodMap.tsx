// (C) 2021 - 2025 GoodData Corporation
import React from "react";

import GeoDiagnostics from "./GeoDiagnostics.js";
import GeoExplorer from "./GeoExplorer.js";

const GoodMapComponent: React.FC = () => {
  return (
    <>
      <GeoDiagnostics />
      <GeoExplorer />
    </>
  );
};

export default GoodMapComponent;
