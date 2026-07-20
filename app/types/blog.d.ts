export interface BlogPost {
    id: string
    title: string
    htmlContent: string
    excerpt?: string
    image?: string
    publishDate?: string
    author?: string
    categories?: string[]
    tags?: string[]
}