export const decodeJwtPayload = <T = Record<string, unknown>>(token: string): T => {
    return JSON.parse(
        Buffer.from(token.split('.')[1], 'base64url').toString()
    ) as T
}