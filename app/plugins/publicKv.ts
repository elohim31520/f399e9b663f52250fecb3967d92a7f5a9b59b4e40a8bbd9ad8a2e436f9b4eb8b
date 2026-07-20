/**
 *
 * 無須 auth 的 KV 快取 $fetch instance。
 * 用於高頻公開資料（行情快取、市場 weights、今日個股等）。
 * 一般 REST 請走 publicApi.ts。
 */

import { showNotify } from 'vant'
import type { ResponseData, Company } from '~/types/api'
import type { MarketQuotes } from '~/types/market'
import type { MomentumResult } from '~/types/marketSnapshots'
import type { TodayStockPrice } from '~/types/stock'
import type { StockMetrics } from '~/types/stockMetrics'
import type { NewsResponse } from '~/types/news'

function createPublicKvClient() {
    return $fetch.create({
        baseURL: import.meta.env.VITE_KV_HOST,
        timeout: 15000, // KV 通常更快，timeout 可以更嚴格

        onRequest({ request }) {
            if (import.meta.dev) {
                console.log('[publicKv]', request)
            }
        },

        onResponse({ response }) {
            let res = response._data

            if (typeof res === 'string') {
                try {
                    res = JSON.parse(res)
                    response._data = res
                } catch {
                    throw new Error('無效的 KV 響應格式')
                }
            }

            if (typeof res?.success === 'boolean' && !res.success) {
                const message = res.message || 'KV 操作失敗'
                if (import.meta.client) {
                    showNotify({ message, background: '#ef4444', color: '#fff' })
                }
                throw new Error(message)
            }
        },

        onResponseError({ response }) {
            const message = response._data?.message || response._data?.error || 'KV 請求失敗'
            if (import.meta.client) {
                showNotify({ message, background: '#ef4444', color: '#fff' })
            }
        },
    })
}

export default defineNuxtPlugin(() => {
    const client = createPublicKvClient()

    return {
        provide: {
            publicKV: {
                // market
                /** days 僅支援 1（1 小時快取）與 3（每日快取），其他 days 請走 bff.getMomentumByRange */
                getMomentumByRange: (days: number) =>
                    client<ResponseData<MomentumResult[]>>(`/market/momentum/range/${days}`),
                getQuotes: () =>
                    client<ResponseData<MarketQuotes[]>>('/market/quotes'),

                // stock
                getCompanySymbols: () =>
                    client<ResponseData<Company[]>>('/stock/symbols'),
                getMarketBreadth: () =>
                    client<ResponseData<number>>('/stock/breadth'),
                getTodayStocks: () =>
                    client<ResponseData<TodayStockPrice[]>>('/stock/today'),

                // metrics
                getStatementBySymbol: (symbol: string, days: number) =>
                    client<ResponseData<StockMetrics>>(`/company-metrics/${symbol}`, { query: { days } }),

                // news
                getNews: () =>
                    client<ResponseData<NewsResponse>>('/news', { query: { page: 1, size: 10 } }),
            },
        },
    }
})