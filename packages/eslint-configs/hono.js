import baseConfig from "@alittlebyte/eslint-configs/base.js"
import honoPlugin from "@hono/eslint-config"

export default [
	...baseConfig,
	{
		plugins: {
			hono: honoPlugin,
		},
	},
]
