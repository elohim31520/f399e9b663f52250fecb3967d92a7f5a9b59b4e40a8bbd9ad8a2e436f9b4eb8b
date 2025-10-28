const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const generateBlogPostsPlugin = (lang: string) => {
	return {
		name: 'generate-blog-posts',
		async buildStart() {
			// @ts-ignore
			const blogPosts: BlogPost[] = []
			const postsDirectory = path.join(process.cwd(), 'blogs', 'info', lang)
			const files = await fs.promises.readdir(postsDirectory)

			for (const file of files) {
				if (file.endsWith('.md')) {
					const filePath = path.join(postsDirectory, file)
					const fileContent = await fs.promises.readFile(filePath, 'utf-8')

					const { data: meta, content } = matter(fileContent)

					const id = file.replace('.md', '')
					blogPosts.push({
						id,
						title: meta.title || id,
						htmlContent: content,
						excerpt: meta.excerpt,
						image: meta.image || '',
						publishDate: meta.publishDate,
						author: meta.author,
						categories: meta.categories,
						tags: meta.tags,
					})
				}
			}
			fs.writeFileSync(
				path.join(process.cwd(), 'server/data/', `blog-posts-${lang}.json`),
				JSON.stringify(blogPosts, null, 2)
			)
		},
	}
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },

	nitro: {
		preset: 'cloudflare-pages',

		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
		},
	},

	modules: [
		'nitro-cloudflare-dev',
		'@nuxtjs/i18n',
		'@nuxtjs/tailwindcss',
		'@pinia/nuxt',
		'@vant/nuxt',
		'nuxt-echarts',
		'@vueuse/nuxt',
		'./modules/nuxt4-lodash',
		[
			'nuxt-vue3-google-signin',
			{
				clientId: GOOGLE_CLIENT_ID,
			},
		],
	],
	i18n: {
		locales: [
			{ code: 'en', file: 'en.json', language: 'en-US' },
			{ code: 'zh', file: 'zh-TW.json', language: 'zh-TW' },
		],
		defaultLocale: 'en',
		strategy: 'prefix_except_default',
		detectBrowserLanguage: {
			useCookie: false,
			redirectOn: 'root', // 只在根路徑時重定向
			alwaysRedirect: false, // 設為 true 會每次都檢查
			fallbackLocale: 'en',
		},
	},
	devServer: {
		port: 5177,
	},
	vant: {
		lazyload: true,
		importStyle: true,
	},
	lodash4: {
		prefix: '_',
		upperAfterPrefix: false,
	},
	app: {
		baseURL: '/',
		head: {
			script: [
				{
					src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3738209519931286',
					async: true,
					crossorigin: 'anonymous',
				},
			],
		},
	},
	vite: {
		vue: {
			script: {
				defineModel: true,
			},
		},
		plugins: [generateBlogPostsPlugin('zh'), generateBlogPostsPlugin('en')],
		base: '/',
		build: {
			assetsDir: '_nuxt',
		},
	},
	typescript: {
		tsConfig: {
			compilerOptions: {
				module: 'esnext',
			},
		},
	},
	css: ['./app/assets/main.css'],
	ssr: true,
	routeRules: {
		//客戶端渲染 (CSR / SPA)
		'/login': { ssr: false },
		'/register': { ssr: false },
		'/add-transaction': { ssr: false },
		'/change-password': { ssr: false },
		'/m7': { ssr: false },
	},
})
