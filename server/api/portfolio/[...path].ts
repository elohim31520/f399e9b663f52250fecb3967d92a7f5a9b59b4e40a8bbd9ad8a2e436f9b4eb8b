/**
 * BFF proxy — portfolio 相關。
 * 從 cookie 取 token，注入後轉發到上游 API。
 *
 * 支援方法：GET / POST / PUT / DELETE
 * 覆蓋路由：/api/portfolio、/api/portfolio/:id
 */

export default defineEventHandler(async (event) => {
    const method = event.method as 'GET' | 'POST' | 'PUT' | 'DELETE'
    const subPath = event.context.params?.path ?? ''
    const upstreamPath = subPath ? `/portfolio/${subPath}` : '/portfolio'
    const body = method !== 'GET' ? await readBody(event) : undefined

    return apiFetch(event, method, upstreamPath, body)
})
