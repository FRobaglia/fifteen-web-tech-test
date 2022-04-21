/// <reference types="vite/client" />

// Typing env variables
interface ImportMetaEnv {
    readonly VITE_MAPBOX_ACCESS_TOKEN: string | undefined
    readonly VITE_API_URL: string | undefined
  }
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}