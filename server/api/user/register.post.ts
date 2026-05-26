export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    const res = await $fetch<{
        code: number
        success: boolean
        data: { token: string }
        message: string
    }>(`${config.apiBaseUrl}/user/register`, {
        method: 'POST' as const,
        body,
    })

    if (!res?.success) {
        return fail(res?.code ?? 400, res?.message ?? '註冊失敗')
    }

    const payload = decodeJwtPayload<{ name: string; id: string; email: string }>(
        res.data.token
    )

    setCookie(event, 'user_token', res.data.token, {
        httpOnly: true,
        secure: config.public.isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    })

    return success({
        name: payload.name,
        id: payload.id,
        email: payload.email,
    })
})