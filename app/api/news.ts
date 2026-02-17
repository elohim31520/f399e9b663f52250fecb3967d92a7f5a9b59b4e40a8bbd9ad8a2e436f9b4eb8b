import type { ResponseData, PaginationParams } from '../types/api'

export class NewsApi {
	private httpRequest: any

	constructor(httpRequest: any) {
		this.httpRequest = httpRequest
	}

	async getNewsKV(): Promise<ResponseData<any[]>> {
		return this.httpRequest({ method: 'GET', endpoint: '/news', params: { page: 1, size: 10 }, useKV: true })
	}

	async getNews({ page, size }: PaginationParams): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'GET', endpoint: '/news', params: { page, size } })
	}
}
