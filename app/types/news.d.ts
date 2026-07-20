export interface News {
    content: string;
    contentEn: string;
    contentHash: string;
    createdAt: string;
    id: number;
    isTop: boolean;
    publishedAt: string | null;
    status: 'draft' | 'published' | 'archived';
    updatedAt: string;
    viewCount: number;
}

export interface NewsResponse {
    rows?: News[]
    count?: number
}