export default defineEventHandler(async (event) => {
    const method = event.method as 'GET' | 'POST' | 'PUT' | 'DELETE'
    const subPath = event.context.params?.path ?? ''
    const upstreamPath = subPath ? `/trade/${subPath}` : '/trade'

    const body = method !== 'GET' ? await readBody(event) : undefined
    return apiFetch(event, method, upstreamPath, body)
})