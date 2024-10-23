import honoPlugin from "@hono/eslint-config"
import globals from "globals"
import base from "./base.js"

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
