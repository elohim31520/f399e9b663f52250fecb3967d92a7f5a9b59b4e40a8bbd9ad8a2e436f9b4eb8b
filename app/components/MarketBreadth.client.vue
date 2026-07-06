<template>
	<div class="bg-white p-2 shadow-card-primary">
		<div class="text-lg font-bold mb-4 text-#434343">
			{{ $t('market_breadth.title') }}
		</div>
		<div class="text-base font-bold text-primary">{{ marketBreadth }}%</div>
		<v-chart class="chart" :option="chartOption" style="height: 400px" />
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatNumber } from '~/utils/util'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const marketBreadth = ref<number>(0)
const { $publicKV } = useNuxtApp()

const chartOption = computed(() => {
	return {
		tooltip: {
			trigger: 'item',
			formatter: '{b}: {d}%',
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: [t('market_breadth.advancers'), t('market_breadth.decliners')],
		},
		series: [
			{
				name: t('market_breadth.advancers'),
				type: 'pie',
				radius: '50%',
				center: ['50%', '60%'],
				color: ['#F88379', '#FDF3F4'],
				data: [
					{
						value: formatNumber(marketBreadth.value),
						name: t('market_breadth.advancers'),
					},
					{
						value: formatNumber(100 - marketBreadth.value),
						name: t('market_breadth.decliners'),
					},
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	}
})

const { data: fetchedData } = await useAsyncData('market-breadth', async () => {
	const res = await $publicKV.getMarketBreadth()
	if (_isNumber(res.data)) {
		return formatNumber(res.data * 100)
	}
})

marketBreadth.value = fetchedData.value ?? 0
</script>
