/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMeta;
}