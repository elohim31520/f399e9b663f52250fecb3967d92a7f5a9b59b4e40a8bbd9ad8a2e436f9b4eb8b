import { httpClient } from '../utils/service'
import type { ResponseData } from '../types/api'
import type { Transaction, TransactionForm } from '../types/transactions'

interface PaginationParams {
	page: number
	size: number
}

class TransactionApi {
	async getAllTransactions({ page, size }: PaginationParams): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'GET', endpoint: '/trade', params: { page, size } })
	}

	async deleteTransaction(id: number): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'DELETE', endpoint: `/trade/${id}` })
	}

	async recordMyTransactions(transaction: Transaction): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'POST', endpoint: '/trade', params: transaction })
	}

	private parseDate(dateStr: string): string | null {
		const date_format = /^\d{4}-\d{2}-\d{2}$/
		if (date_format.test(dateStr)) {
			return dateStr
		}
		return null
	}
}

export const transactionApi = new TransactionApi()
