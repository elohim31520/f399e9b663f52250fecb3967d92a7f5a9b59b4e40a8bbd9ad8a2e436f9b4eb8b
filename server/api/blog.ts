import { marked } from 'marked'
import { defineEventHandler, getQuery } from 'h3'
import blogPostsZh from '../data/blog-posts-zh.json'
import blogPostsEn from '../data/blog-posts-en.json'

const convertMarkdownToHtml = async (fileContent: string) => {
	return await marked(fileContent)
}

interface BlogPost {
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

const blogPostsMap: Record<string, BlogPost[]> = {
	zh: blogPostsZh as BlogPost[],
	en: blogPostsEn as BlogPost[],
}

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const lang = query.lang as string

	const blogPosts = blogPostsMap[lang]
	const processedPosts = await Promise.all(
		blogPosts.map(async (post) => ({
			...post,
			htmlContent: await convertMarkdownToHtml(post.htmlContent),
		}))
	)
	processedPosts.sort((a, b) => +new Date(b.publishDate!) - +new Date(a.publishDate!))
	return processedPosts
})
