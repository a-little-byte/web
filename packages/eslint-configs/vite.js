import react from "@alittlebyte/eslint-configs/react.js"
import pluginQuery from "@tanstack/eslint-plugin-query"
import pluginRouter from "@tanstack/eslint-plugin-router"
import globals from "globals"

export default [
	{
		ignores: ["routeTree.gen.ts"],
	},
	{ languageOptions: { globals: globals.browser } },
	...react,
	...pluginQuery.configs["flat/recommended"],
	...pluginRouter.configs["flat/recommended"],
]
