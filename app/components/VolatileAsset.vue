<template>
	<van-tabs v-model:active="activeTab" type="card" class="p-2" color="#f472b6">
		<van-tab :title="$t('volatile_asset.strong_stocks')">
			<div class="grid grid-cols-1 gap-1 px-1 mt-2">
				<div>
					<ul>
						<li
							v-for="(stock, index) in winners"
							:key="index"
							class="flex items-center py-5 px-2 shadow-primary gap-1"
							@click="handleRoute(stock)"
						>
							<SvgIcon name="icon_ghost" size="2.5rem" />
							<span class="text-gray-600">{{ stock.name }}</span>
							<span class="text-green-600 ml-auto">{{ stock.chg }}%</span>
						</li>
					</ul>
				</div>
			</div>
		</van-tab>

		<van-tab :title="$t('volatile_asset.weak_stocks')">
			<div class="grid grid-cols-1 gap-1 px-1 my-2">
				<ul>
					<li
						v-for="(stock, index) in losers"
						:key="index"
						class="flex items-center py-5 px-2 shadow-primary gap-1"
						@click="handleRoute(stock)"
					>
						<SvgIcon name="icon_ghost" size="2.5rem" />
						<span class="text-gray-600">{{ stock.name }}</span>
						<span class="text-red-500 ml-auto">{{ stock.chg }}%</span>
					</li>
				</ul>
			</div>
		</van-tab>
	</van-tabs>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'

	interface Stock {
		name: string
		symbol?: string | null
		price: string
		chg: number
		ychg: string
		cap: string
		time: string
	}

	const activeTab = ref(0)
	const { $api } = useNuxtApp()

	const { data: fetchedData } = await useAsyncData('volatile-asset', async () => {
		const res = await $api.stock.getTodayStocks()
		return res.data
	})

	const winners = computed(() => {
		return fetchedData.value?.slice(0, 5) || []
	})

	const losers = computed(() => {
		return fetchedData.value?.slice(-5) || []
	})

	const handleRoute = (stock: Stock) => {
		if (stock.symbol) {
			navigateTo(`/company-metrics/${stock.symbol}`)
		}
	}
</script>
