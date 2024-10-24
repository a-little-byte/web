import base from "@alittlebyte/eslint-configs/base.js"
import importPlugin from "eslint-plugin-import"
import pluginReact from "eslint-plugin-react"
import pluginReactHook from "eslint-plugin-react-hooks"
import pluginReactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"

export default [
	{ languageOptions: { globals: globals.browser } },
	...base,
	importPlugin.flatConfigs.react,
	pluginReact.configs.flat.recommended,
	pluginReact.configs.flat["jsx-runtime"],
	pluginReact.configs.flat.recommended,
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
