import { httpClient } from '../utils/service'
import type { ResponseData } from '../types/api'
import type { NewPortfolio, PortfolioWithCompany } from '../types/portfolio'

class PortfolioApi {
	async getMyPortfolio(): Promise<ResponseData<PortfolioWithCompany[]>> {
		return httpClient.request<PortfolioWithCompany[]>({ method: 'GET', endpoint: '/portfolio' })
	}

	async updateMyPortfolio(params: NewPortfolio): Promise<ResponseData<PortfolioWithCompany>> {
		return httpClient.request<PortfolioWithCompany>({ method: 'PUT', endpoint: '/portfolio', params })
	}

	async deleteMyPortfolio(portfolio_id: number): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'DELETE', endpoint: `/portfolio/${portfolio_id}` })
	}

	async createMyPortfolio(params: NewPortfolio): Promise<ResponseData<PortfolioWithCompany>> {
		return httpClient.request<PortfolioWithCompany>({ method: 'POST', endpoint: '/portfolio', params })
	}
}

export const portfolioApi = new PortfolioApi()
