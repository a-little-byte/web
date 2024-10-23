import pluginQuery from "@tanstack/eslint-plugin-query"
import pluginRouter from "@tanstack/eslint-plugin-router"
import importPlugin from "eslint-plugin-import"
import pluginReact from "eslint-plugin-react"
import pluginReactHook from "eslint-plugin-react-hooks"
import pluginReactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import base from "./base.js"

export default [
	{
		ignores: ["routeTree.gen.ts"],
	},
	{ languageOptions: { globals: globals.browser } },
	...base,
	importPlugin.flatConfigs.react,
	pluginReact.configs.flat.recommended,
	pluginReact.configs.flat["jsx-runtime"],
	pluginReact.configs.flat.recommended,
	...pluginQuery.configs["flat/recommended"],
	...pluginRouter.configs["flat/recommended"],
	{
		plugins: {
			"react-hooks": pluginReactHook,
			"react-refresh": pluginReactRefresh,
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			"react/prop-types": 0,
			"react/no-unescaped-entities": [
				"error",
				{
					forbid: [">", "}"],
				},
			],
			"react/react-in-jsx-scope": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "error",
		},
	},
]
