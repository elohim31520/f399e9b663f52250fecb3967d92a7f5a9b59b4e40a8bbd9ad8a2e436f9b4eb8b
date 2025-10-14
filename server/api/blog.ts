import { marked } from 'marked'
import blogPostsData from '../data/blog-posts.json'
import { defineEventHandler } from 'h3'

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

export default defineEventHandler(async (event) => {
	const blogPosts: BlogPost[] = blogPostsData as BlogPost[]

	const processedPosts = await Promise.all(
		blogPosts.map(async (post) => ({
			...post,
			htmlContent: await convertMarkdownToHtml(post.htmlContent),
		}))
	)

	return processedPosts
})
