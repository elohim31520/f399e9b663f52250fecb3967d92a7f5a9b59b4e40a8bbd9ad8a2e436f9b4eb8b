<template>
	<div class="grid grid-cols-1 gap-1 px-1 mt-2">
		<div>
			<ul>
				<li
					v-for="(stock, index) in fetchedData"
					:key="index"
					class="flex items-center py-4 px-2.5 shadow-primary gap-5"
				>
					<CompanyIcon :symbol="stock.symbol || ''" />
					<span class="text-gray-600">{{ stock.name }}</span>
					<span class="text-green-600 ml-auto" :class="{ 'text-red-600': +stock.chg < 0 }">{{ stock.chg }}%</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import CompanyIcon from '../components/CompanyIcon.vue'

	const { $api } = useNuxtApp()

	const { data: fetchedData } = await useAsyncData('volatile-stock', async () => {
		const res = await $api.stock.getTodayStocks()
		return res.data
	})
</script>
