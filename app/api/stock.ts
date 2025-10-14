import { httpClient } from '../utils/service'
import type { ResponseData, Company } from '../types/api'

class StockApi {
	async getCompanySymbols(): Promise<ResponseData<Company[]>> {
		return httpClient.request<Company[]>({ method: 'GET', endpoint: '/stock/symbols', useKV: true })
	}

	// async getAllCompanies(): Promise<ResponseData<Company[]>> {
	// 	return httpClient.request<Company[]>({ method: 'GET', endpoint: '/stock/symbols' })
	// }

	async getMarketBreadth(): Promise<ResponseData<number>> {
		return httpClient.request<number>({ method: 'GET', endpoint: '/stock/breadth', useKV: true })
	}

	async getStockWinners(): Promise<ResponseData<any[]>> {
		return httpClient.request<any[]>({ method: 'GET', endpoint: '/stock/winners', useKV: true })
	}

	async getStockLosers(): Promise<ResponseData<any[]>> {
		return httpClient.request<any[]>({ method: 'GET', endpoint: '/stock/losers', useKV: true })
	}

	async getTodayStocks(): Promise<ResponseData<any[]>> {
		return httpClient.request<any[]>({ method: 'GET', endpoint: '/stock/today', useKV: true })
	}
}

export const stockApi = new StockApi()
