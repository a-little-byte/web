import base from "@alittlebyte/eslint-configs/base.js"
import importX from "eslint-plugin-import-x"
import globals from "globals"

export default [
	{ languageOptions: { globals: globals.node } },
	...base,
	{
		languageOptions: {
			globals: {
				fetch: false,
				Response: false,
				Request: false,
				addEventListener: false,
			},
			ecmaVersion: 2021,
			sourceType: "module",
		},
		plugins: {
			"import-x": importX,
		},
		rules: {
			"no-empty": [
				"warn",
				{
					allowEmptyCatch: true,
				},
			],
			"no-process-exit": "off",
			"no-useless-escape": "off",
			"prefer-const": [
				"warn",
				{
					destructuring: "all",
				},
			],
			"import-x/no-duplicates": "error",
			"import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
			"import-x/order": [
				"error",
				{
					groups: [
						"external",
						"builtin",
						"internal",
						"parent",
						"sibling",
						"index",
					],
					alphabetize: {
						order: "asc",
						caseInsensitive: true,
					},
				},
			],
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-unsafe-function-type": "off",
			"@typescript-eslint/no-empty-function": [
				"error",
				{
					allow: ["arrowFunctions"],
				},
			],
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-inferrable-types": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-var-requires": "off",
		},
	},
]
