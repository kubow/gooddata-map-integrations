// (C) 2026 GoodData Corporation
import { feature } from "topojson-client";
import { getNumericCodes } from "i18n-iso-countries";
import type { Feature, FeatureCollection, Geometry } from "geojson";
// eslint-disable-next-line import/no-unresolved
import countries110m from "world-atlas/countries-110m.json";

export interface CountryFeatureProperties {
  alpha2: string;
  name: string;
}

// world-atlas keys its features by UN M49 numeric country code; GoodData's `GDC.geo.area`
// country display forms use ISO 3166-1 alpha-2 codes instead, so build a lookup once.
const numericToAlpha2 = getNumericCodes();

const rawFeatures = (
  feature(
    countries110m as any,
    (countries110m as any).objects.countries
  ) as unknown as FeatureCollection
).features;

/**
 * World country boundaries (Natural Earth, 110m resolution) keyed by ISO 3166-1 alpha-2 code -
 * the format GoodData's country-level `GDC.geo.area` display forms use.
 */
export const countryBoundaries: FeatureCollection<
  Geometry,
  CountryFeatureProperties
> = {
  type: "FeatureCollection",
  features: rawFeatures.reduce<Feature<Geometry, CountryFeatureProperties>[]>(
    (acc, rawFeature) => {
      const alpha2 = numericToAlpha2[String(rawFeature.id)];
      if (!alpha2) {
        return acc;
      }
      acc.push({
        type: "Feature",
        id: alpha2,
        geometry: rawFeature.geometry,
        properties: {
          alpha2,
          name:
            (rawFeature.properties as { name?: string } | undefined)?.name ??
            alpha2,
        },
      });
      return acc;
    },
    []
  ),
};

/** ISO 3166-1 alpha-2 codes the bundled boundaries can actually shade - country level only. */
export const KNOWN_COUNTRY_CODES = new Set(
  countryBoundaries.features.map((f) => f.properties.alpha2)
);
