// (C) 2026 GoodData Corporation
import {
  newAttribute,
  newMeasure,
  idRef,
  type IAttribute,
  type IMeasure,
} from "@gooddata/sdk-model";

/** A numeric field usable as a map value - a metric, or a fact aggregated with `sum`. */
export type ValueFieldSelection = `measure:${string}` | `fact:${string}`;

/** An attribute field, or no selection at all. */
export type AttributeFieldSelection = "" | `attribute:${string}`;

export function resolveValueMeasure(selection: ValueFieldSelection): IMeasure {
  if (selection.startsWith("measure:")) {
    return newMeasure(idRef(selection.slice("measure:".length), "measure"));
  }
  return newMeasure(idRef(selection.slice("fact:".length), "fact"), (m) =>
    m.aggregation("sum")
  );
}

export function resolveAttribute(
  selection: AttributeFieldSelection
): IAttribute | undefined {
  return selection
    ? newAttribute(selection.slice("attribute:".length))
    : undefined;
}
