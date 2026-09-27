// (C) 2026 GoodData Corporation
import React, { useMemo } from "react";
import { GeoJSON } from "react-leaflet";
import type { Layer, StyleFunction } from "leaflet";
import type { Feature, Geometry } from "geojson";
import {
  countryBoundaries,
  type CountryFeatureProperties,
} from "./countryBoundaries.js";

export interface AreaChoroplethLayerProps {
  valueByCode: Record<string, number>;
  maxValue: number;
  valueLabel: string;
}

function fillColor(value: number | undefined, maxValue: number): string {
  if (value === undefined) {
    return "#e5e7eb";
  }
  const normalized = maxValue > 0 ? value / maxValue : 0;
  const lightness = 85 - normalized * 55;
  return `hsl(215, 70%, ${lightness}%)`;
}

/**
 * Renders GoodData `GDC.geo.area` country values as a Leaflet `GeoJSON` choropleth - the
 * Leaflet-native equivalent of sdk-ui-geo's area (choropleth) layer.
 */
export function AreaChoroplethLayer({
  valueByCode,
  maxValue,
  valueLabel,
}: AreaChoroplethLayerProps) {
  const style: StyleFunction<CountryFeatureProperties> = (feature) => {
    const value = feature ? valueByCode[feature.properties.alpha2] : undefined;
    return {
      fillColor: fillColor(value, maxValue),
      fillOpacity: value === undefined ? 0.15 : 0.75,
      color: "#475569",
      weight: 1,
    };
  };

  const onEachFeature = (
    feature: Feature<Geometry, CountryFeatureProperties>,
    layer: Layer
  ) => {
    const value = valueByCode[feature.properties.alpha2];
    const valueLine =
      value !== undefined
        ? `<br/>${valueLabel}: ${value.toLocaleString()}`
        : "<br/>No data";
    layer.bindPopup(`<strong>${feature.properties.name}</strong>${valueLine}`);
  };

  // react-leaflet's GeoJSON layer does not deep-diff `data`/`style` updates, so re-key it when
  // the underlying values change (the boundaries themselves never do).
  const dataKey = useMemo(() => JSON.stringify(valueByCode), [valueByCode]);

  return (
    <GeoJSON
      key={dataKey}
      data={countryBoundaries}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
}
