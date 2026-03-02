<template>
	<div class="grid grid-cols-1 gap-1 mt-2">
		<!-- 過濾選單 -->
		<div class="px-1 mb-2">
			<van-row gutter="8">
				<!-- 排序方向 -->
				<van-col span="8">
					<van-button size="small" block @click="toggleSort">
						{{ sortOrder === 'asc' ? $t('volatile_stock.sort.asc') : $t('volatile_stock.sort.desc') }}
					</van-button>
				</van-col>

				<!-- 只顯示正值 -->
				<van-col span="8">
					<van-button size="small" block :type="filter === 'positive' ? 'success' : 'default'"
						@click="setFilter('positive')">
						{{ $t('volatile_stock.filter.positive') }}
					</van-button>
				</van-col>

				<!-- 只顯示負值 -->
				<van-col span="8">
					<van-button size="small" block :type="filter === 'negative' ? 'danger' : 'default'"
						@click="setFilter('negative')">
						{{ $t('volatile_stock.filter.negative') }}
					</van-button>
				</van-col>
			</van-row>
		</div>

		<!-- 股票列表 -->
		<ul>
			<li v-for="(stock, index) in displayedData" :key="index"
				class="flex items-center py-1 px-2.5 shadow-card-primary gap-5" @click="handleRoute(stock)">
				<CompanyIcon :symbol="stock.symbol || ''" />
				<span class="text-gray-600">{{ stock.name }}</span>
				<span class="text-green-600 ml-auto" :class="{ 'text-red-600': +stock.dayChg < 0 }">
					{{ stock.dayChg }}%
				</span>
			</li>
		</ul>

		<van-back-top right="1rem" bottom="3.5rem" />
	</div>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp()
import type { TodayStockPrice } from '@/types/stock'

const { data: fetchedData } = await useAsyncData('volatile-stock', async () => {
	const res = await $api.stock.getTodayStocks()
	return res.data
})

// 排序方向：'asc' | 'desc'
const sortOrder = ref<'asc' | 'desc'>('desc')

// 過濾模式：'all' | 'positive' | 'negative'
const filter = ref<'all' | 'positive' | 'negative'>('all')

const toggleSort = () => {
	sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const setFilter = (type: 'positive' | 'negative') => {
	// 再次點選同一個按鈕則取消過濾
	filter.value = filter.value === type ? 'all' : type
}

const displayedData = computed(() => {
	if (!fetchedData.value) return []

	let result = [...fetchedData.value]

	// 過濾
	if (filter.value === 'positive') {
		result = result.filter((s) => +s.dayChg > 0)
	} else if (filter.value === 'negative') {
		result = result.filter((s) => +s.dayChg < 0)
	}

	// 排序
	result.sort((a, b) => {
		const diff = +a.dayChg - +b.dayChg
		return sortOrder.value === 'asc' ? diff : -diff
	})

	return result
})

const handleRoute = (stock: TodayStockPrice) => {
	if (stock.symbol) {
		navigateTo(`/company-metrics/${stock.symbol}`)
	}
}
</script>