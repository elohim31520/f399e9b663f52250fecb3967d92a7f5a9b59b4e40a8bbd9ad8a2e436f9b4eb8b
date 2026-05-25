/**
 * BFF proxy — 餘額相關。
 * 從 cookie 取 token，注入後轉發到上游 API。
 *
 * 支援方法：GET / POST / PUT
 */

export default defineEventHandler(async (event) => {
    const method = event.method as 'GET' | 'POST' | 'PUT'
    const body = method !== 'GET' ? await readBody(event) : undefined

    return apiFetch(event, method, '/balance', body)
})