/**
 * BFF proxy — trade 相關。
 * 從 cookie 取 token，注入後轉發到上游 API。
 *
 * 支援方法：GET / POST / PUT / DELETE
 * 覆蓋路由：
 *   /api/trade
 *   /api/trade/:id
 *   /api/trade/bulk
 *   /api/trade/analyze-screenshot  ← multipart/form-data
 *   /api/trade/ai-job/:jobId
 */

import { proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const method = event.method as 'GET' | 'POST' | 'PUT' | 'DELETE'
    const subPath = event.context.params?.path ?? ''
    const upstreamPath = subPath ? `/trade/${subPath}` : '/trade'
    const rawQuery = getRequestURL(event).search
    const upstreamUrl = `${config.apiBaseUrl}${upstreamPath}${rawQuery}`

    const token = getCookie(event, 'user_token')
    const contentType = getHeader(event, 'content-type') ?? ''

    // ✅ multipart：直接 pipe，完全不碰 binary 資料
    if (method !== 'GET' && contentType.includes('multipart/form-data')) {
        return proxyRequest(event, upstreamUrl, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
    }

    const body = method !== 'GET' ? await readBody(event) : undefined
    return apiFetch(event, method, upstreamPath, body)
})