/**
 * BFF proxy — user 剩餘需要 auth 的端點。
 * 從 cookie 取 token，注入後轉發到上游 API。
 *
 * 覆蓋路由（specific file 優先，不會被這裡攔截）：
 *   /api/user/password     POST  ← changePassword
 *   /api/user/is-login     GET   ← isLogin
 *
 * 以下由各自的 specific server route 處理，不走這裡：
 *   login.post.ts / google-login.post.ts / logout.post.ts / me.get.ts
 */

export default defineEventHandler(async (event) => {
    const method = event.method as 'GET' | 'POST'
    const subPath = event.context.params?.path ?? ''
    const upstreamPath = subPath ? `/user/${subPath}` : '/user'
    const body = method !== 'GET' ? await readBody(event) : undefined

    return apiFetch(event, method, upstreamPath, body)
})
