import type { ResponseData, Company } from '../types/api'

export class StockApi {
	private httpRequest: any

	constructor(httpRequest: any) {
		this.httpRequest = httpRequest
	}

	async getCompanySymbols(): Promise<ResponseData<Company[]>> {
		return this.httpRequest({ method: 'GET', endpoint: '/stock/symbols', useKV: true })
	}

	// async getAllCompanies(): Promise<ResponseData<Company[]>> {
	// 	return this.httpRequest({ method: 'GET', endpoint: '/stock/symbols' })
	// }

	async getMarketBreadth(): Promise<ResponseData<number>> {
		return this.httpRequest({ method: 'GET', endpoint: '/stock/breadth', useKV: true })
	}

	async getTodayStocks(): Promise<ResponseData<any[]>> {
		return this.httpRequest({ method: 'GET', endpoint: '/stock/today', useKV: true })
	}
}
