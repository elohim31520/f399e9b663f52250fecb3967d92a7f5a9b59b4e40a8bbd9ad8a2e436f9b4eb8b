<template>
	<div class="shadow-primary bg-#fff p-2 rounded-xl" v-if="fetchedData?.rows.length">
		<div v-for="(vo, index) in fetchedData.rows">
			<van-text-ellipsis rows="2" :content="vo.content" expand-text="展开" collapse-text="收起" position="end" />
			<van-divider :style="{ borderColor: '#ec4899' }" v-if="index + 1 != fetchedData?.rows.length" />
		</div>
	</div>
</template>

<script setup lang="ts">
	const { $api } = useNuxtApp()

	interface News {
		id?: string
		content: string
		status: 'draft' | 'published' | 'archived'
		publishedAt?: Date
		viewCount?: number
		isTop?: boolean
	}

	interface NewsResponse {
		rows: News[]
		count: number
	}

	const fetchKV = async (): Promise<NewsResponse> => {
		try {
			const res = await $api.news.getNewsKV()
			return res.data as unknown as NewsResponse
		} catch (error) {
			console.error(`Failed to fetch News:`, error)
			return { rows: [], count: 0 }
		}
	}

	const {
		data: fetchedData,
		pending,
		error,
	} = await useAsyncData(
		'news-data',
		() => {
			return fetchKV()
		},
		{
			lazy: true,
			default: () => ({ rows: [], count: 0 } as NewsResponse),
		}
	)
</script>
