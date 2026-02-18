import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
	const { isAuthenticated, setToken, clearToken } = useAuth()
	const isLogin = computed(() => isAuthenticated.value)

	const username = useStorage('username', '')
	const userPicture = useStorage('g_user_picture', '')
	const googleUserName = useStorage('g_user_name', '')

	const userInfo = computed(() => ({
		name: googleUserName.value || username.value,
		picture: userPicture.value || '/avatar/1.webp',
	}))

	function login(token: string) {
		setToken(token)
	}

	function setGoogleUserInfo(picture: string, name: string) {
		userPicture.value = picture
		googleUserName.value = name
	}

	function setUsername(name: string) {
		username.value = name
	}

	function logout() {
		clearToken()
		username.value = ''
		userPicture.value = ''
		googleUserName.value = ''
	}

	return {
		isLogin,
		userInfo,
		username,
		login,
		logout,
		setGoogleUserInfo,
		setUsername,
	}
})
