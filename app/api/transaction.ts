import { httpClient } from '../utils/service'
import type { ResponseData, PaginationParams } from '../types/api'
import type { TradeParams } from '../types/trade'

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

	async updateTransaction(id: number, transaction: TradeParams): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'PUT', endpoint: `/trade/${id}`, params: transaction })
	}

	// 上傳截圖給AI分析後記錄
	async aiAnalyzeScreenshot(file: File): Promise<ResponseData<any>> {
		return httpClient.uploadFile<any>({
			endpoint: '/trade/analyze-screenshot',
			file,
			fieldName: 'image', // 和後端 uploader.single('image') 一致
		})
	}

	async getTradeJobStatus(jobId: string): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'GET', endpoint: `/trade/ai-job/${jobId}` })
	}
}

export const transactionApi = new TransactionApi()
