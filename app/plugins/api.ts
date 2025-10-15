import { showNotify } from 'vant'
import type { ResponseData, FailResponseData, RequestParams } from '../types/api'
import { useUserStore } from '@/stores/user'
import { BalancesApi } from '~/api/balances'

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
			const res = response._data

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

			const host = useKV ? import.meta.env.VITE_KV_HOST : import.meta.env.VITE_API_URL
			const url = host + endpoint

			return await api(url, {
				method,
				...(method.toUpperCase() === 'GET' ? { query: params } : { body: params }),
			})
		} catch (err) {
			if (!quiet) {
				console.error('Request failed:', err)
			}
			throw err
		}
	}

	const balancesApi = new BalancesApi(request)

	return {
		provide: {
			api: {
				balances: balancesApi,
			},
		},
	}
})
