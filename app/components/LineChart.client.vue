<template>
	<v-chart class="chart" :style="{ height }" :option="option" autoresize />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import type { StockMetrics } from '~/types/stockMetrics'

const {
	title,
	lineColor,
	chartData,
	height = '400px',
	smooth = true,
	xAxisKey,
	seriesKey,
} = defineProps<{
	title: string
	lineColor?: string
	chartData: StockMetrics[]
	height?: string
	smooth?: boolean | number
	xAxisKey?: string
	seriesKey?: string
}>()

const xAxisData = computed(() => {
	return chartData.map((item) => new Date(item[xAxisKey as keyof typeof item]).toLocaleDateString())
})

const seriesData = computed(() => {
	return chartData.map((item) => parseFloat(item[seriesKey as keyof typeof item] as keyof StockMetrics))
})

const option = computed<EChartsOption>(() => ({
	title: {
		text: title,
		left: 'center',
	},
	tooltip: {
		trigger: 'axis',
	},
	xAxis: {
		type: 'category',
		data: xAxisData.value,
		splitLine: {
			show: true,
			lineStyle: {
				color: 'rgba(0,0,0,0.06)',
				width: 1,
			},
		},
	},
	yAxis: {
		type: 'value',
		scale: true,
		splitLine: {
			lineStyle: {
				color: 'rgba(0,0,0,0.06)',
				width: 1,
			},
		},
	},
	series: [
		{
			type: 'line',
			symbol: 'none',
			smooth,
			data: seriesData.value,
			itemStyle: {
				color: lineColor || '#F88379',
			},
		},
	],
}))
</script>
