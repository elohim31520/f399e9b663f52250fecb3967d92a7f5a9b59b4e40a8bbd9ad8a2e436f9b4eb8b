import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

type OgType =
	| 'website'
	| 'article'
	| 'book'
	| 'profile'
	| 'music.song'
	| 'music.album'
	| 'music.playlist'
	| 'music.radio_status'
	| 'video.movie'
	| 'video.episode'
	| 'video.tv_show'
	| 'video.other'

export interface PageSeoOptions {
	title?: string
	description?: string
	ogImage?: string
	ogType?: OgType
	robots?: string
}

export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions> = {}) {
	const { t } = useI18n()

	const resolved = computed(() => {
		const opts = toValue(options)
		return {
			title: opts.title ?? t('meta.default_title'),
			description: opts.description ?? t('meta.default_description'),
			ogImage: opts.ogImage,
			ogType: opts.ogType ?? 'website',
			robots: opts.robots,
		}
	})

	useSeoMeta({
		title: () => resolved.value.title,
		description: () => resolved.value.description,
		ogTitle: () => resolved.value.title,
		ogDescription: () => resolved.value.description,
		ogImage: () => resolved.value.ogImage,
		ogType: () => resolved.value.ogType,
		twitterCard: 'summary_large_image',
		twitterTitle: () => resolved.value.title,
		twitterDescription: () => resolved.value.description,
		twitterImage: () => resolved.value.ogImage,
		robots: () => resolved.value.robots,
	})
}
