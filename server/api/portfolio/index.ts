export default defineEventHandler(async (event) => {
    const method = event.method as 'GET' | 'POST' | 'PUT' | 'DELETE'
    const body = method !== 'GET' ? await readBody(event) : undefined
    return apiFetch(event, method, '/portfolio', body)
})