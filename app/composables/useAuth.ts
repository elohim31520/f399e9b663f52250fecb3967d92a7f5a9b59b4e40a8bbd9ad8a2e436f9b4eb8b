import { API_CONFIG } from '../config/api'

export const useAuth = () => {
	const userToken = useCookie(API_CONFIG.TOKEN_KEY, {
		maxAge: 60 * 60 * 24 * 7, // 7 天
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
	})

	const isAuthenticated = computed(() => !!userToken.value)

	const setToken = (token: string) => userToken.value = token
	const clearToken = () => userToken.value = null

	return {
		userToken,
		isAuthenticated, //給middleware使用的
		setToken,
		clearToken,
	}
}
