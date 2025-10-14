export default defineNuxtPlugin(() => {
    const { userToken } = useAuth()
  
    const api = $fetch.create({
      baseURL: '/api', // 或你的 API base URL
      onRequest({ options }) {
        // 自動注入 token
        if (userToken.value) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${userToken.value}`
          }
        }
      },
      onResponseError({ response }) {
        // 401 自動登出
        if (response.status === 401) {
          const { clearAuth } = useAuth()
          clearAuth()
          navigateTo('/login')
        }
      }
    })
  
    return {
      provide: {
        api
      }
    }
  })