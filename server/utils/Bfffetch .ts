/**
 * Server-side BFF fetch 工具。
 *
 * 職責：從 httpOnly cookie 取出 user_token Authorization header，
 * 再轉發到上游後端 VITE_API_URL
 *
 * Token 不會外露到 client JS，整個注入動作只發生在 server 端。
 */

import type { H3Event } from 'h3'
import type { NitroFetchOptions } from 'nitropack'
type HttpMethod = NitroFetchOptions<string>['method']

export type { HttpMethod }

export async function apiFetch(
    event: H3Event,
    method: string,
    path: string,
    body?: any
) {
    const token = getCookie(event, 'user_token')

    // 把 client 帶來的 query string 一起轉發
    const rawQuery = getRequestURL(event).search // e.g. "?page=1&size=10"
    const upstreamUrl = `${process.env.VITE_API_URL}${path}${rawQuery}`

    return $fetch(upstreamUrl, {
        method: method as HttpMethod,
        body,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })
}