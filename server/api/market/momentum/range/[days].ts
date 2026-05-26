const KV_DAYS = new Set([7, 30])

export default defineEventHandler(async (event) => {
    const days = Number(event.context.params?.days)

    // days = 7 / 30 → 帶 token，但 host 改走 VITE_KV_HOST
    if (KV_DAYS.has(days)) {
        const token = getCookie(event, 'user_token')
        const rawQuery = getRequestURL(event).search
        const kvUrl = `${process.env.VITE_KV_HOST}/market/momentum/range/${days}${rawQuery}`

        return $fetch(kvUrl, {
            method: 'GET',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
    }

    return apiFetch(event, 'GET', `/market/momentum/range/${days}`)
})