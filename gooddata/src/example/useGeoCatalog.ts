// (C) 2026 GoodData Corporation
import { useEffect, useState } from "react";
import { newAttribute, type IAttribute } from "@gooddata/sdk-model";
import { backend } from "../backend.js";

export interface GeoFieldOption {
  id: string;
  title: string;
}

/**
 * A pair of latitude/longitude display forms found on the same attribute - the shape
 * GeoPushpinChart (and pushpin layers) need for their `latitude`/`longitude` props.
 */
export interface GeoLocationOption {
  key: string;
  attributeTitle: string;
  latitude: IAttribute;
  longitude: IAttribute;
}

/** A `GDC.geo.area` display form - the shape GeoAreaChart (and area layers) need for `area`. */
export interface GeoAreaOption {
  key: string;
  attributeTitle: string;
  label: string;
  area: IAttribute;
}

export interface GeoCatalog {
  attributes: GeoFieldOption[];
  measures: GeoFieldOption[];
  facts: GeoFieldOption[];
  geoLocations: GeoLocationOption[];
  geoAreas: GeoAreaOption[];
}

export type GeoCatalogState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; catalog: GeoCatalog };

/**
 * Loads the workspace catalog and groups its `GDC.geo.*` display forms into ready-to-use
 * latitude/longitude pairs and area attributes, alongside the plain attributes/measures/facts
 * used to build ad-hoc pushpin/area/combined layers when no matching insight exists.
 */
export function useGeoCatalog(workspace: string | undefined): GeoCatalogState {
  const [state, setState] = useState<GeoCatalogState>({ status: "loading" });

  useEffect(() => {
    if (!workspace) {
      return;
    }
    let cancelled = false;

    const load = async () => {
      setState({ status: "loading" });
      try {
        const catalog = await backend
          .workspace(workspace)
          .catalog()
          .forTypes(["attribute", "measure", "fact"])
          .withPageSize(1000)
          .load();

        const catalogAttributes = catalog.attributes();
        const catalogMeasures = catalog.measures();
        const catalogFacts = catalog.facts();

        const attributes = catalogAttributes.map((item) => ({
          id: item.attribute.id,
          title: item.attribute.title,
        }));
        const measures = catalogMeasures.map((item) => ({
          id: item.measure.id,
          title: item.measure.title,
        }));
        const facts = catalogFacts.map((item) => ({
          id: item.fact.id,
          title: item.fact.title,
        }));

        const geoLocations: GeoLocationOption[] = [];
        const geoAreas: GeoAreaOption[] = [];

        catalogAttributes.forEach((catalogAttribute) => {
          const attributeTitle = catalogAttribute.attribute.title;
          const geoDisplayForms = [
            ...catalogAttribute.displayForms,
            ...catalogAttribute.geoPinDisplayForms,
          ].filter((displayForm) =>
            displayForm.displayFormType?.startsWith("GDC.geo.")
          );

          const latitude = geoDisplayForms.find(
            (displayForm) =>
              displayForm.displayFormType === "GDC.geo.pin_latitude"
          );
          const longitude = geoDisplayForms.find(
            (displayForm) =>
              displayForm.displayFormType === "GDC.geo.pin_longitude"
          );
          if (latitude && longitude) {
            geoLocations.push({
              key: catalogAttribute.attribute.id,
              attributeTitle,
              latitude: newAttribute(latitude.id),
              longitude: newAttribute(longitude.id),
            });
          }

          const area = geoDisplayForms.find(
            (displayForm) => displayForm.displayFormType === "GDC.geo.area"
          );
          if (area) {
            geoAreas.push({
              key: area.id,
              attributeTitle,
              label: area.title ?? attributeTitle,
              area: newAttribute(area.id),
            });
          }
        });

        if (!cancelled) {
          setState({
            status: "success",
            catalog: { attributes, measures, facts, geoLocations, geoAreas },
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [workspace]);

  return state;
}
