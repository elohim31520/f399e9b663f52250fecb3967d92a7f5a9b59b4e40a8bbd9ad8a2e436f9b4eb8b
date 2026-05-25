import { getCookie } from 'h3'
import { API_CONFIG } from '../config/api'

export const useAuth = () => {
	// useState 會在 SSR → Client hydration 時保留狀態
	const isAuthenticated = useState<boolean>('auth.isAuthenticated', () => {
		if (import.meta.server) {
			const event = useRequestEvent()
			const token = getCookie(event!, API_CONFIG.TOKEN_KEY)
			return !!token
		}
		return false
	})

	// BFF 模式下，token 操作改成呼叫 server endpoint
	const logout = async () => {
		await $fetch('/api/user/logout', { method: 'POST' })
		isAuthenticated.value = false
	}

	return {
		isAuthenticated,
		logout,
	}
}