/**
 * BFF proxy — market 需要 auth 的端點。
 * 從 cookie 取 token，注入後轉發到上游 API。
 *
 * 覆蓋路由（僅 GET）：
 *   /api/market/momentum
 *   /api/market/weights
 *   /api/market/momentum/range/:days  （days 非 1 / 3）
 *
 * 公開的 market 端點（summary、quotes、/:symbol 等）
 * 由 client 直接呼叫 publicApi / publicKv，不走這裡。
 */

export default defineEventHandler(async (event) => {
    const subPath = event.context.params?.path ?? ''
    const upstreamPath = subPath ? `/market/${subPath}` : '/market'

    return apiFetch(event, 'GET', upstreamPath)
})