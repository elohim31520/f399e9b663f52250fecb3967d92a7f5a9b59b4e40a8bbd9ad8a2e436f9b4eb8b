export interface TodayStockPrice {
	name: string
	symbol?: string | null
	price: string
	dayChg: number
	weight: string
	createdAt: Date
}