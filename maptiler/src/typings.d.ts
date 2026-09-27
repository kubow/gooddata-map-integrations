// (C) 2019-2022 GoodData Corporation
declare module "*.svg";
declare module "*.png";
declare module "*.css";
declare const WORKSPACE_ID: string;

interface ImportMetaEnv {
  readonly VITE_MAPTILER_TOKEN?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
