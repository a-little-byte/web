import base from "@alittlebyte/eslint-configs/base.js"
import honoPlugin from "@hono/eslint-config"
import globals from "globals"

export default [
	{ languageOptions: { globals: globals.node } },
	...base,
	...honoPlugin,
	{
		rules: {
			quotes: ["error", "double"],
		},
	},
]
