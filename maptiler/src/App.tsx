// (C) 2019-2023 GoodData Corporation
import React from "react";
import { BackendProvider, WorkspaceProvider } from "@gooddata/sdk-ui";
import { backend } from "./backend.js";
import MapTilerComponent from "./example/MapTiler.js";

// Workspace ID is injected by bundler based on the value in package.json
const workspaceId = WORKSPACE_ID;

export const App: React.FC = () => {
    return (
        <BackendProvider backend={backend}>
            <WorkspaceProvider workspace={workspaceId}>
                <div className="app">
                    <MapTilerComponent />
                </div>
            </WorkspaceProvider>
        </BackendProvider>
    );
};
