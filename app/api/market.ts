import type { ResponseData, Company } from '../types/api'

export class MarketApi {
	private httpRequest: any

	constructor(httpRequest: any) {
		this.httpRequest = httpRequest
	}

	async getAllMomentum(): Promise<ResponseData<any[]>> {
		return this.httpRequest({ method: 'GET', endpoint: '/market/momentum' })
	}

	async getMomentumByRange(days: number): Promise<ResponseData<any[]>> {
		return this.httpRequest({ method: 'GET', endpoint: `/market/momentum/range/${days}`, useKV: true })
	}

	async getMarketWeights(): Promise<ResponseData<any[]>> {
		return this.httpRequest({ method: 'GET', endpoint: '/market/weights' })
	}

	async getQuotes(): Promise<ResponseData<any[]>> {
		return this.httpRequest({ method: 'GET', endpoint: '/market/quotes', useKV: true })
	}

	async getMarketSummary(): Promise<ResponseData<any>> {
		return this.httpRequest({ method: 'GET', endpoint: '/market/summary' })
	}
}
