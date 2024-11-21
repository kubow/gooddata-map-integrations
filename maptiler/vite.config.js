// (C) 2007-2025 GoodData Corporation
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createHtmlPlugin } from "vite-plugin-html";
//import packageJson from "./package.json";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    entry: "src/index.tsx",
    plugins: [
        react(),
        createHtmlPlugin({
            entry: "/src/index.tsx",
            template: "./src/public/index.html",
        }),
    ],
    define: {
        HOST: JSON.stringify(process.env.VITE_BACKEND_URL),
        TOKEN: JSON.stringify(process.env.VITE_TIGER_API_TOKEN),
        WORKSPACE_ID: JSON.stringify(process.env.VITE_WORKSPACE),
        DASHBOARD_ID: JSON.stringify(process.env.VITE_DASHBOARD),
        VISUAL_ID: JSON.stringify(process.env.VITE_VISUAL),
    },
    resolve: {
        alias: {
            "~@gooddata": "/node_modules/@gooddata",
        },
    },
    build:{
        outDir: 'esm',
        chunkSizeWarningLimit:10000
    },
    server: {
        port: 8080,
        fs: {
            strict: false,
        },
        proxy: {
            "/api": {
                changeOrigin: true,
                cookieDomainRewrite: "localhost",
                secure: false,
                target: process.env.VITE_BACKEND_URL,
                headers: {
                    host: process.env.VITE_BACKEND_URL,
                    origin: null,
                },
                configure: (proxy) => {
                    proxy.on("proxyReq", (proxyReq) => {
                        // changeOrigin: true does not work well for POST requests, so remove origin like this to be safe
                        proxyReq.removeHeader("origin");
                        proxyReq.setHeader("accept-encoding", "identity");
                    });
                },
            },
        },
    },
});
