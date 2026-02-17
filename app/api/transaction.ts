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

	async aiAnalyzeScreenshot(file: File): Promise<ResponseData<any>> {
		return httpClient.uploadFile<any>({ 
			endpoint: '/trade/analyze-screenshot',
			file,
			fieldName: 'image', // 和後端 uploader.single('image') 一致
		})
	}
}

export const transactionApi = new TransactionApi()
