export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuthenticated } = useAuth()
    const localePath = useLocalePath()

    if (!isAuthenticated.value && to.path !== '/login') {
        return navigateTo(localePath('/login'))
    }

    if (isAuthenticated.value && to.path === '/login') {
        return navigateTo(localePath('/'))
    }
})