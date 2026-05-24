interface ResponseData<T> {
    code: number
    success: boolean
    data: T
    message: string
}

interface FailResponseData {
    code: number | null
    success: false
    data: null
    message: string
}

export function success<T>(data: T, message = '成功'): ResponseData<T> {
    return { code: 200, success: true, data, message }
}

export function fail(code: number | null, message = 'error'): FailResponseData {
    return { success: false, data: null, code, message }
}