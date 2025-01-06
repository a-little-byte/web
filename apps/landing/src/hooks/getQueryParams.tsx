type QueryParams = {
	search?: string
	orderBy?: "price" | "newest" | "availability"
}

export const getQueryParams = (): QueryParams => {
	const urlParams = new URLSearchParams(window.location.search)
	const params = Object.fromEntries(urlParams)
	const hasParams = Object.keys(params).length > 0

	return hasParams
		? {
				search: params.search,
				orderBy: params.orderBy as QueryParams["orderBy"],
			}
		: {}
}
