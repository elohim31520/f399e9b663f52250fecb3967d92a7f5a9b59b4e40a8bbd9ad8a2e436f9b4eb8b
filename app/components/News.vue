<template>
	<div class="shadow-card-primary bg-#fff p-2 rounded-xl" v-if="fetchedData?.rows.length">
		<h1 class="text-lg font-bold flex-center mb-2">{{ $t('news.title') }}</h1>
		<div v-for="(vo, index) in fetchedData.rows">
			<van-text-ellipsis
				rows="2"
				:content="getDisplayContent(vo)"
				:expand-text="$t('com.expand')"
				:collapse-text="$t('com.collapse')"
				position="end"
			/>
			<van-divider :style="{ borderColor: '#ec4899' }" v-if="index + 1 != fetchedData?.rows.length" />
		</div>
	</div>
</template>

<script setup lang="ts">
	const { $api } = useNuxtApp()
	const { locale } = useI18n()

	interface News {
		id?: string
		content: string
		contentEn: string | null
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

	const getDisplayContent = (vo: any) => {
		if (locale.value === 'en' && vo.contentEn) {
			return vo.contentEn
		}

		return vo.content
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
