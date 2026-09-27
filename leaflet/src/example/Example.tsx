// (C) 2021-2026 GoodData Corporation
import React from "react";
import LeafletExplorer from "./LeafletExplorer.js";
import Hint from "../Hint.js";

/**
 * Example component demonstrating GoodData + Leaflet integration.
 *
 * LeafletExplorer discovers the workspace's geo-labeled attributes and renders three views built
 * on Leaflet's own primitives: pushpin markers (`CircleMarker`), an area choropleth (`GeoJSON`),
 * and both combined - the Leaflet equivalent of `@gooddata/sdk-ui-geo`'s pushpin/area/multi-layer
 * charts, for a mapping library GoodData has no native chart renderer for.
 */
const Example: React.FC = () => {
  return (
    <div className="leaflet-example">
      <h1>GoodData + Leaflet Integration</h1>

      <section className="example-section">
        <h2>Interactive Map</h2>
        <p>
          Location data comes straight from GoodData's semantic layer: any
          attribute with <code>GDC.geo.pin_latitude</code>/
          <code>GDC.geo.pin_longitude</code> display forms becomes a pushpin
          location, and any attribute with a <code>GDC.geo.area</code> display
          form becomes a choropleth region.
        </p>

        <LeafletExplorer />
      </section>

      <Hint hint="Edit LeafletExplorer.tsx to change how the map is built from your workspace." />
    </div>
  );
};

export default Example;
