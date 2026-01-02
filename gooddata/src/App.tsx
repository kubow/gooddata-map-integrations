// (C) 2019-2025 GoodData Corporation
import React from "react";
import { BackendProvider, WorkspaceProvider } from "@gooddata/sdk-ui";
import { backend } from "./backend.js";
import GoodMapComponent from "./example/GoodMap.js";

// ID values are injected by bundler based on the value in vite.config.js
const workspaceId = WORKSPACE_ID;
const dashboardId = DASHBOARD_ID;
const visualId = VISUAL_ID;
console.log(
  "..default dashboard: " + dashboardId + " \n... visual: " + visualId
);

export const App: React.FC = () => {
  return (
    <BackendProvider backend={backend}>
      <WorkspaceProvider workspace={workspaceId}>
        <div className="app">
          <GoodMapComponent />
        </div>
      </WorkspaceProvider>
    </BackendProvider>
  );
};
