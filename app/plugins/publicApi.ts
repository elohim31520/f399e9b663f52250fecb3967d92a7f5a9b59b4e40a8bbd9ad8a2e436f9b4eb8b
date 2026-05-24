/**
 *
 * 無須 auth 的公開 REST API $fetch instance。
 * 僅用於不帶 token 的資料請求。
 * KV 快取請走 publicKv.ts。
 */

import { showNotify } from 'vant'
import type { ResponseData, NewsPagination } from '~/types/api'


function createPublicApiClient() {
    return $fetch.create({
        baseURL: import.meta.env.VITE_API_URL,
        timeout: 30000,

        onResponse({ response }) {
            let res = response._data

            if (typeof res === 'string') {
                try {
                    res = JSON.parse(res)
                    response._data = res
                } catch {
                    throw new Error('無效的響應格式')
                }
            }

            if (typeof res?.success === 'boolean' && !res.success) {
                const message = res.message || '操作失敗'
                if (import.meta.client) {
                    showNotify({ message, background: '#ef4444', color: '#fff' })
                }
                throw new Error(message)
            }
        },

        onResponseError({ response }) {
            const message = response._data?.message || response._data?.error || '請求失敗'
            if (import.meta.client) {
                showNotify({ message, background: '#ef4444', color: '#fff' })
            }
        },
    })
}


export default defineNuxtPlugin(() => {
    const client = createPublicApiClient()

    return {
        provide: {
            publicApi: {
                // market
                getAllMomentum: () =>
                    client<ResponseData<any[]>>('/market/momentum'),
                getMarketWeights: () =>
                    client<ResponseData<any[]>>('/market/weights'),
                getMarketSummary: () =>
                    client<ResponseData<any>>('/market/summary'),

                // news
                getNews: (params: NewsPagination) =>
                    client<ResponseData<any>>('/news', { query: params }),
            },
        },
    }
})