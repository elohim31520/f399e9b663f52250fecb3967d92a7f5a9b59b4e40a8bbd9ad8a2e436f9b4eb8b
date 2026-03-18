import type { ResponseData, PaginationParams } from '../types/api'

interface NewsPagination extends PaginationParams {
	keyword?: string | undefined
	lang?: string
}

export class NewsApi {
	private httpRequest: any

	constructor(httpRequest: any) {
		this.httpRequest = httpRequest
	}

	async getNewsKV(): Promise<ResponseData<any[]>> {
		return this.httpRequest({ method: 'GET', endpoint: '/news', params: { page: 1, size: 10 }, useKV: true })
	}

	async getNews({ page, size, keyword, lang = 'zh' }: NewsPagination): Promise<ResponseData<any>> {
		return this.httpRequest({ method: 'GET', endpoint: '/news', params: { page, size, keyword, lang } })
	}
}
