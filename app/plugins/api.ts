import { showNotify } from 'vant'
import type { ResponseData, FailResponseData, RequestParams } from '../types/api'
import { useUserStore } from '@/stores/user'
import { BalancesApi } from '~/api/balances'
import { MarketApi } from '~/api/market'

export default defineNuxtPlugin(() => {
	const api = $fetch.create({
		baseURL: import.meta.env.VITE_API_URL,
		timeout: 30000,

		onRequest({ options }) {
			// 自動注入 token
			const token = useCookie('user_token').value
			if (token) {
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${token}`,
				} as any
			}
		},

		onResponse({ response }) {
			let res = response._data

			if (typeof res === 'string') {
				try {
					res = JSON.parse(res)
					response._data = res // 更新 response._data
				} catch (e) {
					console.error('JSON parse error:', e)
					throw new Error('無效的響應格式')
				}
			}

			if (typeof res?.success === 'boolean' && !res.success) {
				const message = res.message || '操作失敗'
				if (import.meta.client) {
					showNotify({
						message,
						background: '#ef4444',
						color: '#fff',
					})
				}
				throw new Error(message)
			}
		},

		onResponseError({ response }) {
			const message = response._data?.message || '請求失敗'

			if (import.meta.client) {
				showNotify({
					message,
					background: '#ef4444',
					color: '#fff',
				})
			}

			// 401 自動登出
			if (response.status === 401) {
				if (import.meta.client) {
					const userStore = useUserStore()
					userStore.logout()
				} else {
					navigateTo('/login')
				}
			}
		},
	})

	// 提供類似的 request 方法介面
	const request = async <T>({
		method,
		endpoint,
		params,
		quiet = false,
		useKV = false,
	}: RequestParams): Promise<ResponseData<T>> => {
		try {
			if (import.meta.env.VITE_UNUSE_KV === 'true') {
				useKV = false
			}

			// 如果使用 KV，則完全覆蓋 baseURL
			const options: any = {
				method,
				...(method.toUpperCase() === 'GET' ? { query: params } : { body: params }),
			}

			if (useKV) {
				options.baseURL = import.meta.env.VITE_KV_HOST
			}

			if (import.meta.dev) {
				console.log('發api:', (useKV ? import.meta.env.VITE_KV_HOST : import.meta.env.VITE_API_URL) + endpoint)
			}

			return await api<ResponseData<T>>(endpoint, options)
		} catch (err) {
			if (!quiet) {
				console.error('Request failed:', err)
			}
			throw err
		}
	}

	const balancesApi = new BalancesApi(request)
	const marketApi = new MarketApi(request)

	return {
		provide: {
			api: {
				balances: balancesApi,
				market: marketApi,
			},
		},
	}
})
