export default defineEventHandler((event) => {
    deleteCookie(event, 'user_token')
    return { success: true }
})
