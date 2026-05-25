import { decodeJwtPayload } from '../../utils/jwt'

export default defineEventHandler((event) => {
    const token = getCookie(event, 'user_token')

    if (!token) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const payload = decodeJwtPayload<{ name: string; id: string; email: string }>(token)

    return {
        name: payload.name,
        id: payload.id,
        email: payload.email,
    }
})