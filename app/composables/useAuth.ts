import { API_CONFIG } from '../config/api'

export const useAuth = () => {
	const userToken = useCookie(API_CONFIG.TOKEN_KEY, {
		maxAge: 60 * 60 * 24 * 7, // 7 天
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
	})

	const user = useState('user', () => null)

	const setToken = (token: string) => {
		userToken.value = token
	}

	const clearAuth = () => {
		userToken.value = null
		user.value = null
	}

	const isAuthenticated = computed(() => !!userToken.value)

	return {
		userToken,
		user,
		setToken,
		clearAuth,
		isAuthenticated,
		isLogin: isAuthenticated,
	}
}
