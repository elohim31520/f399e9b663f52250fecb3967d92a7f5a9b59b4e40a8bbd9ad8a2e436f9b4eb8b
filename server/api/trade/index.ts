export default defineEventHandler(async (event) => {
    const method = event.method as 'GET' | 'POST' | 'PUT' | 'DELETE'
    const subPath = event.context.params?.path ?? ''
    const upstreamPath = subPath ? `/trade/${subPath}` : '/trade'

    // multipart/form-data（截圖辨識）：重建 FormData 後轉發
    const contentType = getHeader(event, 'content-type') ?? ''
    if (method !== 'GET' && contentType.includes('multipart/form-data')) {
        const parts = await readMultipartFormData(event)
        const formData = new FormData()

        for (const part of parts ?? []) {
            if (part.filename) {
                formData.append(
                    part.name!,
                    new Blob([part.data], { type: part.type }),
                    part.filename
                )
            } else {
                formData.append(part.name!, new TextDecoder().decode(part.data))
            }
        }

        return apiFetch(event, method, upstreamPath, formData)
    }

    const body = method !== 'GET' ? await readBody(event) : undefined
    return apiFetch(event, method, upstreamPath, body)
})