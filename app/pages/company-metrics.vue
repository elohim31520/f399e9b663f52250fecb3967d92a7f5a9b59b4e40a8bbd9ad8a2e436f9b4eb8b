<template>
	<div class="p-4 space-y-4">
		<div class="mb-[3.75rem]">
			<TradingviewGadget :symbol="symbol" :symbolPrefix="symbolPrefix" :disabled="uiStore.isMenuShown" />
		</div>

		<van-notice-bar
			v-if="showNotice"
			left-icon="info-o"
			wrapable
			:scrollable="false"
			type="warning"
			:mode="'closeable'"
			@close="showNotice = false"
		>
			{{ $t('company_metrics.pe_forwards_notice') }}
		</van-notice-bar>

		<template v-if="metrics.length">
			<MultiLineChart
				:title="`${bigSymbol} PE Ratios`"
				:chart-data="metrics"
				x-axis-key="ct"
				:series="[
					{
						name: $t('company_metrics.pe_forwards_title'),
						key: 'fpe',
						color: '#FF5733',
					},
					{
						name: $t('company_metrics.pe_history_title'),
						key: 'pe',
						color: '#00CED1',
					},
				]"
			/>

			<van-notice-bar
				v-if="showNotice"
				left-icon="info-o"
				wrapable
				:scrollable="false"
				type="warning"
				:mode="'closeable'"
				@close="showNotice = false"
			>
				{{ $t('company_metrics.eps_notice') }}
			</van-notice-bar>

			<DualAxisBarChart
				:title="`${bigSymbol} ${$t('company_metrics.eps_comparison')}`"
				:chart-data="metrics"
				x-axis-key="ct"
				first-series-key="feps"
				second-series-key="eps"
				:first-series-name="$t('company_metrics.feps_title')"
				:second-series-name="$t('company_metrics.eps_history_title')"
				firstSeriesColor="#ED6A0C"
				secondSeriesColor="#00CED1"
			/>

			<BarChart
				:title="`${bigSymbol} ${$t('company_metrics.volume_title')}`"
				:chart-data="metrics"
				x-axis-key="ct"
				series-key="v"
			/>
		</template>

		<div v-else>
			<div class="flex-y-center justify-center font-[500] mb-2">
				{{ `${bigSymbol} ${$t('company_metrics.pe_forwards_title')}` }}...
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue'
	import { useRoute } from 'vue-router'
	import { metricsApi } from '@/api/metrics'
	import { useUIStore } from '@/stores/ui'
	import { NYSE } from '../constants/symbolPrefix'

	const uiStore = useUIStore()
	const route = useRoute()

	const symbol = computed(() => {
		return route.params.symbol as string
	})

	const symbolPrefix = computed(() => {
		if (NYSE.includes(_upperCase(symbol.value))) return 'NYSE'
		return 'NASDAQ'
	})

	const bigSymbol = computed(() => {
		return symbol.value?.toUpperCase()
	})

	const showNotice = ref(true)

	const metrics = ref<any[]>([])

	const getMetrics = async (days: number = 60) => {
		// 只有熱門股票的資料可以不做認證就可以看
		const response = await metricsApi.getStatementBySymbol(symbol.value, days)
		metrics.value = _reverse(_get(response, 'data', []))
	}

	onMounted(() => {
		getMetrics()
	})
</script>
