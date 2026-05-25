import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
	const { isAuthenticated } = useAuth()
	const isLogin = computed(() => isAuthenticated.value)

	const username = useStorage('username', '')
	const userPicture = useStorage('g_user_picture', '')
	const googleUserName = useStorage('g_user_name', '')

	const userInfo = computed(() => ({
		name: googleUserName.value || username.value,
		picture: userPicture.value || '/avatar/1.webp',
	}))

	// BFF 從 httpOnly cookie 讀 JWT 回傳用戶資料
	async function fetchMe() {
		try {
			const data = await $fetch('/api/user/me')
			username.value = data.name
			isAuthenticated.value = true
		} catch {
			// 401 或其他錯誤，視為未登入
			isAuthenticated.value = false
		}
	}

	function setGoogleUserInfo(picture: string, name: string) {
		userPicture.value = picture
		googleUserName.value = name
	}

	function setUsername(name: string) {
		username.value = name
	}

	async function logout() {
		await $fetch('/api/user/logout', { method: 'POST' })
		isAuthenticated.value = false
		username.value = ''
		userPicture.value = ''
		googleUserName.value = ''
	}

	return {
		isLogin,
		userInfo,
		username,
		fetchMe,
		logout,
		setGoogleUserInfo,
		setUsername,
	}
})
