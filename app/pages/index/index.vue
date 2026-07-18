<template>
	<main class="p-4 space-y-4">
		<header>
			<h1 class="text-lg font-bold flex-center text-primary">{{ $t('home.title') }}</h1>
		</header>
		<News />
		<SeeMore :to="'/news'" class="my-2.5" />
		<MomentumChart />
		<HeatMap class="h-[425px] my-2.5" />
		<MarketQuotes />
		<MarketBreadth />
		<VolatileAsset />
		<SeeMore :to="'/volatile-stock'" class="my-2.5" />
		<!-- 公司入口 -->
		<HotCompanies />
		<SeeMore :to="'/companies'" class="my-2.5" />
	</main>
</template>

<script setup lang="ts">
const { t } = useI18n()

usePageSeo(computed(() => ({
	title: t('home.meta_title'),
	description: t('home.meta_description'),
})))
</script>
