import type { ResponseData } from '../types/api'

export class BalancesApi {
	private httpRequest: any

	constructor(httpRequest: any) {
		this.httpRequest = httpRequest
	}

	async getMyBalances(): Promise<ResponseData<any>> {
		return this.httpRequest({ method: 'GET', endpoint: '/balance' })
	}

	async updateMyBalances(params: any): Promise<ResponseData<any>> {
		return this.httpRequest({ method: 'PUT', endpoint: '/balance', params })
	}

	async createMyBalances(params: any): Promise<ResponseData<any>> {
		return this.httpRequest({ method: 'POST', endpoint: '/balance', params })
	}
}
