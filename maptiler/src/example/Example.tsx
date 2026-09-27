// (C) 2021-2026 GoodData Corporation
import React from "react";
import MapTilerExplorer from "./MapTilerExplorer.js";
import Hint from "../Hint.js";

/**
 * Example component demonstrating GoodData + MapTiler integration.
 *
 * MapTilerExplorer discovers the workspace's geo-labeled attributes and renders three views built
 * on the MapTiler SDK's own (MapLibre-based) primitives: pushpin markers or a heatmap, an area
 * choropleth (GeoJSON fill/line layers), and both combined - the MapTiler equivalent of
 * `@gooddata/sdk-ui-geo`'s pushpin/area/multi-layer charts, for a mapping library GoodData has no
 * native chart renderer for.
 */
const Example: React.FC = () => {
  return (
    <div className="maptiler-example">
      <h1>GoodData + MapTiler Integration</h1>

      <section className="example-section">
        <h2>Interactive Map</h2>
        <p>
          Location data comes straight from GoodData's semantic layer: any
          attribute with <code>GDC.geo.pin_latitude</code>/
          <code>GDC.geo.pin_longitude</code> display forms becomes a pushpin
          location, and any attribute with a <code>GDC.geo.area</code> display
          form becomes a choropleth region.
        </p>

        <MapTilerExplorer />
      </section>

      <Hint hint="Edit MapTilerExplorer.tsx to change how the map is built from your workspace." />
    </div>
  );
};

export default Example;
