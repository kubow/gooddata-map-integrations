// (C) 2026 GoodData Corporation
import React, { useMemo } from "react";
import { CircleMarker, Popup } from "react-leaflet";
import type { PushpinPoint } from "./usePushpinPoints.js";

const SEGMENT_PALETTE = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

function segmentColor(segment: string, order: string[]): string {
  const index = order.indexOf(segment);
  return SEGMENT_PALETTE[index % SEGMENT_PALETTE.length];
}

// Gradient from blue (low) to red (high), matching the palette used elsewhere in this repo.
function gradientColor(value: number, maxValue: number): string {
  const normalized = maxValue > 0 ? value / maxValue : 0;
  const r = Math.round(255 * normalized);
  const b = Math.round(255 * (1 - normalized));
  return `rgb(${r}, 100, ${b})`;
}

function radiusFor(value: number | undefined, maxValue: number): number {
  if (value === undefined) {
    return 8;
  }
  const normalized = (value / (maxValue || 1)) * 20;
  return Math.max(5, Math.min(25, normalized + 5));
}

export interface PushpinLayerProps {
  points: PushpinPoint[];
  valueLabel: string;
}

/** Renders GoodData location + value (+ optional segment) data as Leaflet `CircleMarker`s. */
export function PushpinLayer({ points, valueLabel }: PushpinLayerProps) {
  const maxValue = useMemo(() => {
    const values = points
      .filter((point) => point.value !== undefined)
      .map((point) => point.value as number);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [points]);

  const segmentOrder = useMemo(() => {
    const seen: string[] = [];
    points.forEach((point) => {
      if (point.segment && !seen.includes(point.segment)) {
        seen.push(point.segment);
      }
    });
    return seen;
  }, [points]);

  return (
    <>
      {points.map((point, index) => {
        const color = point.segment
          ? segmentColor(point.segment, segmentOrder)
          : gradientColor(point.value ?? 0, maxValue);

        return (
          <CircleMarker
            key={`${point.name}-${index}`}
            center={[point.lat, point.lng]}
            radius={radiusFor(point.value, maxValue)}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div className="marker-popup">
                <strong>{point.name}</strong>
                {point.segment ? <p>{point.segment}</p> : null}
                {point.value !== undefined ? (
                  <p>
                    {valueLabel}:{" "}
                    <span className="value">
                      {point.value.toLocaleString()}
                    </span>
                  </p>
                ) : null}
                <p className="coords">
                  Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
