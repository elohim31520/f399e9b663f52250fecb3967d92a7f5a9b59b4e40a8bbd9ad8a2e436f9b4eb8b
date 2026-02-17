import { httpClient } from '../utils/service'
import type { ResponseData } from '../types/api'
import type { TradeParams } from '../types/trade'

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

	async recordMyTransactions(transaction: TradeParams): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'POST', endpoint: '/trade', params: transaction })
	}

	// 上傳截圖給AI分析後記錄
	async aiAnalyzeScreenshot(file: File): Promise<ResponseData<any>> {
		return httpClient.uploadFile<any>({ 
			endpoint: '/trade/analyze-screenshot',
			file,
			fieldName: 'image', // 和後端 uploader.single('image') 一致
		})
	}
}

export const transactionApi = new TransactionApi()
