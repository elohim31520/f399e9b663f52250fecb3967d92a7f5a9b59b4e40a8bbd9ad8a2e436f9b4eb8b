/**
 * 需要 auth 的請求統一走 BFF（/api/*）。
 * Client 只傳 cookie，token 注入由 server/api/ 層處理，不再外露到 client JS。
 *
 * 對應的 server route 格式：/server/api/<resource>.ts
 */

import type { ResponseData } from '~/types/api'
import { createFetchHandlers } from '~/utils/fetchHandlers'

// baseURL 指向 Nuxt server routes（/api/...），走同源請求，cookie 自動帶入。

function createBffClient() {
    return $fetch.create({
        baseURL: '/api',
        timeout: 30000,
        credentials: 'include', // 確保 cookie 帶出去
        ...createFetchHandlers({ handle401: true }),
    })
}


export default defineNuxtPlugin(() => {
    const client = createBffClient()

    return {
        provide: {
            bffApi: {
                // ── balance ──────────────────────────────────────────────
                getMyBalances: () =>
                    client<ResponseData<any>>('/balance'),
                createMyBalances: (params: any) =>
                    client<ResponseData<any>>('/balance', { method: 'POST', body: params }),
                updateMyBalances: (params: any) =>
                    client<ResponseData<any>>('/balance', { method: 'PUT', body: params }),

                // ── market（需 auth）─────────────────────────────────────
                getMomentum: () =>
                    client<ResponseData<any[]>>('/market/momentum'),
                getMarketWeights: () =>
                    client<ResponseData<any[]>>('/market/weights'),
                /** days 非 1 / 3 時需要 auth，走 BFF；1 / 3 天請走 publicKv */
                getMomentumByRange: (days: number) =>
                    client<ResponseData<any[]>>(`/market/momentum/range/${days}`),

                // ── portfolio ─────────────────────────────────────────────
                getPortfolios: () =>
                    client<ResponseData<any[]>>('/portfolio'),
                createPortfolio: (params: any) =>
                    client<ResponseData<any>>('/portfolio', { method: 'POST', body: params }),
                updatePortfolio: (params: any) =>
                    client<ResponseData<any>>('/portfolio', { method: 'PUT', body: params }),
                deletePortfolio: (id: string | number) =>
                    client<ResponseData<any>>(`/portfolio/${id}`, { method: 'DELETE' }),

                // ── trade ─────────────────────────────────────────────────
                getTrades: (params?: Record<string, any>) =>
                    client<ResponseData<any>>('/trade', { query: params }),
                getTradeById: (id: string | number) =>
                    client<ResponseData<any>>(`/trade/${id}`),
                createTrade: (params: any) =>
                    client<ResponseData<any>>('/trade', { method: 'POST', body: params }),
                bulkCreateTrades: (params: any) =>
                    client<ResponseData<any>>('/trade/bulk', { method: 'POST', body: params }),
                updateTrade: (id: string | number, params: any) =>
                    client<ResponseData<any>>(`/trade/${id}`, { method: 'PUT', body: params }),
                deleteTrade: (id: string | number) =>
                    client<ResponseData<any>>(`/trade/${id}`, { method: 'DELETE' }),
                /** 截圖辨識：傳 FormData，由 server route 轉 multipart 轉發 */
                analyzeScreenshot: (formData: FormData) =>
                    client<ResponseData<any>>('/trade/analyze-screenshot', {
                        method: 'POST',
                        body: formData,
                    }),
                getAIJobStatus: (jobId: string) =>
                    client<ResponseData<any>>(`/trade/ai-job/${jobId}`),

                // ── user（需 auth 的部分）────────────────────────────────
                /** login / google-login / logout / me 各自有 specific server route，不在此列 */
                changePassword: (params: any) =>
                    client<ResponseData<any>>('/user/password', { method: 'POST', body: params }),
                isLogin: () =>
                    client<ResponseData<boolean>>('/user/is-login'),
            },
        },
    }
})