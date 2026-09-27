// (C) 2021-2026 GoodData Corporation
import React from "react";
import OpenLayersExplorer from "./OpenLayersExplorer.js";
import Hint from "../Hint.js";

/**
 * Example component demonstrating GoodData + OpenLayers integration.
 *
 * OpenLayersExplorer discovers the workspace's geo-labeled attributes and renders three views
 * built on OpenLayers' own primitives: a data-driven point layer (or its native heatmap layer),
 * an area choropleth (vector polygon layer), and both combined - the OpenLayers equivalent of
 * `@gooddata/sdk-ui-geo`'s pushpin/area/multi-layer charts, for a mapping library GoodData has no
 * native chart renderer for.
 */
const Example: React.FC = () => {
  return (
    <div className="openlayers-example">
      <h1>GoodData + OpenLayers Integration</h1>

      <section className="example-section">
        <h2>Interactive Map</h2>
        <p>
          Location data comes straight from GoodData's semantic layer: any
          attribute with <code>GDC.geo.pin_latitude</code>/
          <code>GDC.geo.pin_longitude</code> display forms becomes a pushpin
          location, and any attribute with a <code>GDC.geo.area</code> display
          form becomes a choropleth region.
        </p>

        <OpenLayersExplorer />
      </section>

      <Hint hint="Edit OpenLayersExplorer.tsx to change how the map is built from your workspace." />
    </div>
  );
};

export default Example;
