export default defineNuxtRouteMiddleware((to, from) => {
	const { isAuthenticated } = useAuth()

	// 如果未登入且不是前往登入頁
	if (!isAuthenticated.value && to.path !== '/login') {
		return navigateTo('/login')
	}

	// 如果已登入且要去登入頁，重導向到首頁
	if (isAuthenticated.value && to.path === '/login') {
		return navigateTo('/')
	}
})
