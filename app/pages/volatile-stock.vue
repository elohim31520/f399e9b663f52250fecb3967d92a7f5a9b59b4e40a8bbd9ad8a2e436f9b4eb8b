<template>
	<div class="grid grid-cols-1 gap-1 px-1 mt-2">
		<ul>
			<li v-for="(stock, index) in fetchedData" :key="index"
				class="flex items-center py-1 px-2.5 shadow-card-primary gap-5" @click="handleRoute(stock)">
				<CompanyIcon :symbol="stock.symbol || ''" />
				<span class="text-gray-600">{{ stock.name }}</span>
				<span class="text-green-600 ml-auto" :class="{ 'text-red-600': +stock.dayChg < 0 }">{{ stock.dayChg
				}}%</span>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp()
import type { TodayStockPrice } from '@/types/stock'

const { data: fetchedData } = await useAsyncData('volatile-stock', async () => {
	const res = await $api.stock.getTodayStocks()
	return res.data
})

const handleRoute = (stock: TodayStockPrice) => {
	if (stock.symbol) {
		navigateTo(`/company-metrics/${stock.symbol}`)
	}
}
</script>
