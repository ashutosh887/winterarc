/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Microsoft Clarity project id. Unset locally and in forks, so analytics stay off. */
  readonly VITE_CLARITY_ID?: string
  /** Baked in from package.json at build time. See vite.config.ts. */
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
