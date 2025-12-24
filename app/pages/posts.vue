<template>
	<div>
		<a class="flex-y-center justify-center text-primary my-4" target="blank" :href="infoLink">
			{{ $t('see_more.text') }}
			<SvgIcon name="icon_arrow_right" size="1rem" />
		</a>
		<ul v-if="fetchedPost && fetchedPost.length" class="mx-4">
			<li v-for="post in fetchedPost" :key="post.id" class="mb-20">
				<NuxtLink :to="localePath(`/post/${post.id}`)">
					<img :src="post.image" :alt="post.title" class="object-fit" />
					<div class="p-2">
						<h2>{{ post.title }}</h2>
					</div>
					<div class="text-gray-400 text-right px-4">{{ post.publishDate }}</div>
				</NuxtLink>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useI18n } from 'vue-i18n'

	const { locale } = useI18n()
	const localePath = useLocalePath()

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

	const infoLink = computed(() => {
		return locale.value === 'zh' ? 'https://lazypod.org/info' : 'https://lazypod.org/info-en/'
	})

	const { data: fetchedPost } = await useAsyncData<BlogPost[]>(`blog-posts-${locale.value}`, () =>
		$fetch<BlogPost[]>('/api/blog', {
			query: { lang: locale.value }, // ← 傳遞語系參數
		})
	)
</script>

<style scoped>
	h2 {
		font-weight: bold;
		font-size: 1.5rem;
	}
</style>
