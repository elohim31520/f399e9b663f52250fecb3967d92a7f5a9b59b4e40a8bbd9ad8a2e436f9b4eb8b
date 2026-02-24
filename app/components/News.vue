<template>
	<div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100" v-if="fetchedData?.rows.length">
		<!-- Header -->
		<div class="flex items-center gap-2 px-4 pt-4 pb-3">
			<div class="flex-1 h-px bg-gradient-to-r from-transparent via-[#F88379] to-transparent" />
			<div class="flex items-center gap-1.5">
				<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
				<h1 class="text-sm font-bold tracking-widest uppercase text-primary">{{ $t('news.title') }}</h1>
				<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
			</div>
			<div class="flex-1 h-px bg-gradient-to-r from-transparent via-[#F88379] to-transparent" />
		</div>

		<!-- News List -->
		<div class="px-4 pb-4 space-y-0">
			<div v-for="(vo, index) in fetchedData.rows" :key="vo.id" class="group relative py-3"
				:class="{ 'border-t border-dashed border-slate-100': index !== 0 }">
				<!-- 左側指示條 -->
				<div
					class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-gradient-to-b from-pink-500 to-[#F88379] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

				<van-text-ellipsis rows="2" :content="getDisplayContent(vo)" :expand-text="$t('com.expand')"
					:collapse-text="$t('com.collapse')" position="end"
					class="text-[13px] leading-relaxed text-slate-600 pl-3" />
			</div>
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
