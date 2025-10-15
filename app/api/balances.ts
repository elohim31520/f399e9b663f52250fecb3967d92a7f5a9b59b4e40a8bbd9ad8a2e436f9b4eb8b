import type { ResponseData } from '../types/api'

export class BalancesApi {
	private httpRequest: any

	constructor(httpRequest: any) {
		this.httpRequest = httpRequest
	}

	/**
	 * 取得我的餘額
	 */
	async getMyBalances(): Promise<ResponseData<any>> {
		return this.httpRequest({ method: 'GET', endpoint: '/balances' })
	}

	/**
	 * 更新我的餘額
	 */
	async updateMyBalances(params: any): Promise<ResponseData<any>> {
		return this.httpRequest({ method: 'PUT', endpoint: '/balances', params })
	}

	/**
	 * 新增我的餘額
	 */
	async createMyBalances(params: any): Promise<ResponseData<any>> {
		return this.httpRequest({ method: 'POST', endpoint: '/balances', params })
	}
}
