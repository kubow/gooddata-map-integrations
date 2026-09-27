import React, { useEffect, useMemo, useState } from "react";
import { useWorkspace } from "@gooddata/sdk-ui";
import { modifyAttribute } from "@gooddata/sdk-model";
import * as Md from "../catalog.js";
import { backend } from "../backend.js";

type CatalogMetadata = {
  id?: string;
  title?: string;
  type?: string;
  ref?: { identifier?: string; uri?: string };
  displayFormType?: string;
  attribute?: { identifier?: string };
};

type CatalogItem = {
  type: string;
  attribute?: CatalogMetadata;
  measure?: CatalogMetadata;
  fact?: CatalogMetadata;
  defaultDisplayForm?: CatalogMetadata;
  displayForms?: CatalogMetadata[];
  geoPinDisplayForms?: CatalogMetadata[];
};

type DiagnosticState = {
  status: "loading" | "success" | "error";
  catalog?: {
    attributes: CatalogItem[];
    measures: CatalogItem[];
    facts: CatalogItem[];
    geoLabels: Array<{
      attribute: string;
      attributeId?: string;
      title?: string;
      id?: string;
      type?: string;
    }>;
  };
  availableItems?: CatalogItem[];
  coordinateProbe?: {
    status: "success" | "error";
    rows?: number;
    sample?: unknown;
    error?: string;
  };
  error?: string;
};

const refKey = (
  ref: { identifier?: string; uri?: string } | undefined
): string | undefined => ref?.identifier ?? ref?.uri;

const metadataKey = (
  metadata: CatalogMetadata | undefined
): string | undefined => refKey(metadata?.ref) ?? metadata?.id;

const itemKey = (item: any): string | undefined => {
  if (item?.attribute?.displayForm) return refKey(item.attribute.displayForm);
  if (item?.measure?.definition?.measureDefinition?.item) {
    return refKey(item.measure.definition.measureDefinition.item);
  }
  return metadataKey(item?.attribute ?? item?.measure ?? item?.fact);
};

const itemKeys = (item: CatalogItem): string[] => {
  if (item.attribute) {
    return [
      metadataKey(item.attribute),
      metadataKey(item.defaultDisplayForm),
      ...(item.displayForms ?? []).map(metadataKey),
      ...(item.geoPinDisplayForms ?? []).map(metadataKey),
    ].filter((key): key is string => Boolean(key));
  }

  const key = itemKey(item);
  return key ? [key] : [];
};

const metadataTitle = (item: CatalogItem): string =>
  item.attribute?.title ??
  item.measure?.title ??
  item.fact?.title ??
  "Untitled";

const formatCatalogItem = (item: CatalogItem): string => {
  const key = itemKey(item);
  return key ? `${metadataTitle(item)} (${key})` : metadataTitle(item);
};

const requestedItems = [
  Md.CustomerCity.CityPushpinLatitude,
  Md.CustomerCity.CityPushpinLongitude,
  Md.TotalSales,
  Md.CustomerCity.Default,
  Md.ActiveCustomers,
];

const latitude = modifyAttribute(
  Md.CustomerCity.CityPushpinLatitude,
  (builder) => builder.localId("geo_customer_city_latitude")
);
const longitude = modifyAttribute(
  Md.CustomerCity.CityPushpinLongitude,
  (builder) => builder.localId("geo_customer_city_longitude")
);

const GeoDiagnostics: React.FC = () => {
  const workspace = useWorkspace();
  const [diagnostics, setDiagnostics] = useState<DiagnosticState>({
    status: "loading",
  });

  const requestedKeys = useMemo(
    () =>
      requestedItems.map(itemKey).filter((key): key is string => Boolean(key)),
    []
  );

  useEffect(() => {
    if (!workspace) return;

    let cancelled = false;

    const inspect = async () => {
      setDiagnostics({ status: "loading" });

      try {
        const catalog = await backend
          .workspace(workspace)
          .catalog()
          .forTypes(["attribute", "measure", "fact"])
          .withPageSize(1000)
          .load();

        const attributes = catalog.attributes() as unknown as CatalogItem[];
        const measures = catalog.measures() as unknown as CatalogItem[];
        const facts = catalog.facts() as unknown as CatalogItem[];
        const geoLabels = attributes.flatMap((attribute) => {
          const attributeName = metadataTitle(attribute);
          const attributeId = metadataKey(attribute.attribute);
          const displayForms = [
            ...(attribute.displayForms ?? []),
            ...(attribute.geoPinDisplayForms ?? []),
          ].filter(
            (displayForm, index, allDisplayForms) =>
              allDisplayForms.findIndex(
                (candidate) =>
                  metadataKey(candidate) === metadataKey(displayForm) &&
                  candidate.displayFormType === displayForm.displayFormType
              ) === index
          );

          return displayForms
            .filter((displayForm) =>
              displayForm.displayFormType?.startsWith("GDC.geo.")
            )
            .map((displayForm) => ({
              attribute: attributeName,
              attributeId,
              title: displayForm.title,
              id: metadataKey(displayForm),
              type: displayForm.displayFormType,
            }));
        });

        let coordinateProbe: DiagnosticState["coordinateProbe"];
        try {
          const result = await backend
            .workspace(workspace)
            .execution()
            .forItems([latitude, longitude])
            .execute();
          const dataView = await result.readAll();
          const attributeValues = (slice: unknown): unknown[] => {
            if (!Array.isArray(slice)) return [];
            return slice.map((header) => {
              const item = (header as any)?.attributeHeaderItem;
              return {
                name: item?.name ?? null,
                normalizedValue: item?.normalizedValue ?? null,
                uri: item?.uri ?? null,
              };
            });
          };
          const dimensions = dataView.headerItems ?? [];
          coordinateProbe = {
            status: "success",
            rows: Math.max(...(dataView.totalCount ?? [0])),
            sample: dimensions
              .flatMap((dimension) =>
                Array.isArray(dimension)
                  ? dimension.map((slice) => attributeValues(slice).slice(0, 3))
                  : []
              )
              .slice(0, 4),
          };
        } catch (error) {
          coordinateProbe = {
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          };
          console.warn("GoodData coordinate execution probe failed:", error);
        }

        if (!cancelled) {
          setDiagnostics({
            status: "success",
            catalog: { attributes, measures, facts, geoLabels },
            coordinateProbe,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setDiagnostics({
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    };

    void inspect();
    return () => {
      cancelled = true;
    };
  }, [workspace]);

  if (!workspace) return null;
  if (diagnostics.status === "loading")
    return <p>Inspecting GoodData catalog…</p>;
  if (diagnostics.status === "error") {
    return (
      <pre className="error-container">
        Catalog diagnostics failed: {diagnostics.error}
      </pre>
    );
  }

  const catalog = diagnostics.catalog!;
  const catalogKeys = new Set(
    [...catalog.attributes, ...catalog.measures, ...catalog.facts].flatMap(
      itemKeys
    )
  );
  return (
    <details className="geo-diagnostics">
      <summary>GoodData geo/AFM diagnostics</summary>
      <p>
        Workspace <code>{workspace}</code>: {catalog.attributes.length}{" "}
        attributes, {catalog.measures.length} measures, {catalog.facts.length}{" "}
        facts.
      </p>

      <h4>Requested chart items</h4>
      <ul>
        {requestedKeys.map((key) => (
          <li key={key}>
            <code>{key}</code>:{" "}
            {catalogKeys.has(key)
              ? "present in catalog"
              : "MISSING from catalog"}
          </li>
        ))}
      </ul>

      <h4>Geo display forms</h4>
      {catalog.geoLabels.length === 0 ? (
        <p>No GDC.geo.* display forms were returned.</p>
      ) : (
        <ul>
          {catalog.geoLabels.map((label) => (
            <li key={`${label.attributeId}-${label.id}-${label.type}`}>
              <code>{label.type}</code> {label.attribute} —{" "}
              {label.title ?? label.id}
            </li>
          ))}
        </ul>
      )}

      <h4>Measures and facts</h4>
      <p>
        Measures: {catalog.measures.map(formatCatalogItem).join(", ") || "none"}
        <br />
        Facts: {catalog.facts.map(formatCatalogItem).join(", ") || "none"}
      </p>

      <h4>Coordinate execution probe</h4>
      {diagnostics.coordinateProbe?.status === "success" ? (
        <pre>
          {diagnostics.coordinateProbe.rows ?? 0} rows returned.
          {"\n"}
          Sample: {JSON.stringify(diagnostics.coordinateProbe.sample, null, 2)}
        </pre>
      ) : (
        <pre className="error-container">
          {diagnostics.coordinateProbe?.error ?? "Probe did not run."}
        </pre>
      )}
    </details>
  );
};

export default GeoDiagnostics;
