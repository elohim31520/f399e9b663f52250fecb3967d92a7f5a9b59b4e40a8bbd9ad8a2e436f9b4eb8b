import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { showNotify } from 'vant'
import { API_CONFIG } from '../config/api'
import type { ResponseData, FailResponseData, RequestParams, UploadParams } from '../types/api'
import Cookies from 'js-cookie'
import { useUserStore } from '@/stores/user'

const getHeaders = (isFormData = false): Record<string, string> => {
	const headers: Record<string, string> = {}

	// ✅ 只在非 FormData 時設置 Content-Type
	if (!isFormData) {
		headers['Content-Type'] = 'application/json'
	}

	const token = Cookies.get('user_token')
	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}

	return headers
}

class HttpClient {
	private static instance: HttpClient
	private service: AxiosInstance

	private constructor() {
		this.service = axios.create({
			baseURL: API_CONFIG.BASE_URL,
			timeout: API_CONFIG.TIMEOUT,
		})

		this.setupInterceptors()
	}

	public static getInstance(): HttpClient {
		if (!HttpClient.instance) {
			HttpClient.instance = new HttpClient()
		}
		return HttpClient.instance
	}

	private setupInterceptors(): void {
		this.service.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				// ✅ 在這裡動態設置 headers
				const isFormData = config.data instanceof FormData
				const headers = getHeaders(isFormData)

				Object.entries(headers).forEach(([key, value]) => {
					config.headers.set(key, value)
				})
				return config
			},
			(error: AxiosError) => {
				return Promise.reject(error)
			}
		)

		this.service.interceptors.response.use(
			(response: AxiosResponse<ResponseData<any>>) => {
				const res = response.data

				if (typeof res.success === 'boolean' && !res.success) {
					const message = res.message || '操作失敗'
					showNotify({
						message,
						background: '#ef4444',
						color: '#fff',
					})
					return Promise.reject(res)
				}
				return response
			},
			(error: AxiosError<FailResponseData>) => {
				const message = error.response?.data?.message || error.message || '請求失敗'
				showNotify({
					message,
					background: '#ef4444',
					color: '#fff',
				})

				const response: FailResponseData = {
					success: false,
					data: null,
					code: error.response?.status || null,
					message,
				}

				if (response.code == 401) {
					const userStore = useUserStore()
					userStore.logout()
				}
				return Promise.reject(response)
			}
		)
	}

	public async request<T>({
		method,
		endpoint,
		params,
		quiet = false,
		useKV = false,
	}: RequestParams): Promise<ResponseData<T>> {
		try {
			if (import.meta.env.VITE_UNUSE_KV === 'true') {
				useKV = false
			}

			// 決定 baseURL
			const baseURL = useKV ? import.meta.env.VITE_KV_HOST : import.meta.env.VITE_API_URL

			if (import.meta.dev) {
				console.log('發api:', baseURL + endpoint)
			}

			const config: any = {
				method,
				url: endpoint,
				baseURL,
				...(method.toUpperCase() === 'GET' ? { params } : { data: params }),
			}

			const response: AxiosResponse<ResponseData<T>> = await this.service(config)
			return response.data
		} catch (err) {
			if (!quiet) {
				console.error('Request failed:', err)
			}
			throw err
		}
	}

	public async uploadFile<T>({
		endpoint,
		file,
		fieldName = 'file',
		additionalData = {},
		onProgress,
		quiet = false,
		useKV = false,
	}: UploadParams): Promise<ResponseData<T>> {
		try {
			if (import.meta.env.VITE_UNUSE_KV === 'true') {
				useKV = false
			}

			const baseURL = useKV ? import.meta.env.VITE_KV_HOST : import.meta.env.VITE_API_URL

			if (import.meta.dev) {
				console.log('上傳檔案:', baseURL + endpoint)
			}

			// 建立 FormData
			const formData = new FormData()
			formData.append(fieldName, file)

			// 附加額外資料
			Object.keys(additionalData).forEach(key => {
				formData.append(key, additionalData[key])
			})

			const config: any = {
				method: 'POST',
				url: endpoint,
				baseURL,
				data: formData,
				// 上傳進度
				...(onProgress && {
					onUploadProgress: (progressEvent: any) => {
						const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
						onProgress(progress)
					}
				})
			}

			const response: AxiosResponse<ResponseData<T>> = await this.service(config)
			return response.data
		} catch (err) {
			if (!quiet) {
				console.error('Upload failed:', err)
			}
			throw err
		}
	}
}

export const httpClient = HttpClient.getInstance()
export type { InternalAxiosRequestConfig as AxiosRequestConfig }
