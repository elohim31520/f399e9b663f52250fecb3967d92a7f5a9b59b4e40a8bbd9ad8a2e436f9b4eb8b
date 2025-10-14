import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
	const { isAuthenticated, setToken, clearAuth } = useAuth()
	const isLogin = ref(!!isAuthenticated.value)
	console.log('登入狀態', isLogin.value)

	const username = useStorage('username', '')
	const userPicture = useStorage('g_user_picture', '')
	const googleUserName = useStorage('g_user_name', '')

	const userInfo = computed(() => {
		return {
			name: googleUserName.value || username.value,
			picture: userPicture.value || '/avatar/1.webp',
		}
	})

	function checkLoginStatus() {
		isLogin.value = isAuthenticated.value
	}

	function login(token: string) {
		setToken(token)
		isLogin.value = true
	}

	function setGoogleUserInfo(picture: string, name: string) {
		userPicture.value = picture
		googleUserName.value = name
	}

	function setUsername(name: string) {
		username.value = name
	}

	function logout() {
		clearAuth()
		isLogin.value = false
		username.value = ''
		userPicture.value = ''
		googleUserName.value = ''
	}

	return {
		isLogin,
		username,
		userPicture,
		googleUserName,
		userInfo,
		checkLoginStatus,
		login,
		setGoogleUserInfo,
		setUsername,
		logout,
	}
})
