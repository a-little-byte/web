/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SERVICES_AUTH_BASEURL: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
