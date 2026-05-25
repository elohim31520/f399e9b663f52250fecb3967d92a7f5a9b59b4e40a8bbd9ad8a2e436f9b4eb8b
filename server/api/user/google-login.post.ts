import { decodeJwtPayload } from '../../utils/jwt'
import { success, fail } from '../../utils/response'


export default defineEventHandler(async (event) => {
    const { credential } = await readBody(event)
    console.log('即將登入');


    const res = await $fetch<{
        code: number
        success: boolean
        data: { token: string, picture: string, name?: string }
        message: string
    }>(
        `${process.env.VITE_API_URL}/user/google/login`,
        { method: 'POST' as const, body: { credential } }
    )

    if (!res?.success) {
        return fail(res?.code ?? 400, res?.message ?? '登入失敗')
    }

    console.log('登入成功');

    const payload = decodeJwtPayload<{ name: string; id: string; email: string }>(
        res.data.token
    )

    console.log('res.data.token', res.data.token);


    setCookie(event, 'user_token', res.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    })

    return success({
        name: payload.name,
        id: payload.id,
        email: payload.email,
        picture: res.data.picture
    })
})