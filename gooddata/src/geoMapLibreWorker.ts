// (C) 2026 GoodData Corporation
import * as maplibregl from "maplibre-gl";

// @gooddata/sdk-ui-geo locates its bundled MapLibre worker via a path relative to its own
// compiled module (import.meta.url + "../../../../worker/maplibre-gl-worker.js"). Vite's dev
// dependency pre-bundler flattens the package into node_modules/.vite/deps, which sits at a
// different location but the same directory depth, so that relative path resolves outside the
// package (e.g. to the monorepo root) and 404s, leaving the map without its worker and blank.
//
// Setting the worker URL ourselves - before any GeoChart mounts - wins the race: the package only
// falls back to its own (broken-in-dev) computation when no worker URL has been set yet. This
// import.meta.url reference lives in our own source, which Vite never relocates, so it always
// resolves correctly in both dev and production builds.
const workerUrl = new URL(
  "../node_modules/@gooddata/sdk-ui-geo/worker/maplibre-gl-worker.js",
  import.meta.url
).href;

if (!maplibregl.getWorkerUrl()) {
  maplibregl.setWorkerUrl(workerUrl);
}
