import { format } from 'date-fns'

export const formatDate = (dateStr: string) => {
    if (!dateStr) return '—'
    return format(new Date(dateStr), 'yyyy-MM-dd')
}

export const formatTime = (ts: number) => {
    return format(new Date(ts), 'HH:mm:ss')
}