/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Microsoft Clarity project id. Unset locally and in forks, so analytics stay off. */
  readonly VITE_CLARITY_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
