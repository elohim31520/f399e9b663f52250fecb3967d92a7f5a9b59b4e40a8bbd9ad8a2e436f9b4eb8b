<template>
	<div class="w-full" :style="{ height: height || '400px' }">
		<v-chart v-if="chartData.length" style="width: 100%; height: 100%;" :option="option" autoresize />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption, LineSeriesOption } from 'echarts'
import type { StockMetrics } from '~/types/stockMetrics'

interface Series {
	name: string
	key: keyof StockMetrics
	color?: string
}

const props = defineProps<{
	title: string
	chartData: StockMetrics[]
	height?: string
	smooth?: boolean | number
	xAxisKey: keyof StockMetrics
	series: Series[]
}>()

const xAxisData = computed<string[]>(() => {
	return props.chartData.map((item) => new Date(item[props.xAxisKey] as string | number | Date).toLocaleDateString())
})

const seriesData = computed<LineSeriesOption[]>(() => {
	return props.series.map((series) => ({
		name: series.name,
		type: 'line',
		smooth: props.smooth,
		data: props.chartData.map((item) => parseFloat(String(item[series.key]))),
		itemStyle: {
			color: series.color || '#F88379',
		},
	}))
})

const option = computed<EChartsOption>(() => ({
	title: {
		text: props.title,
		left: 'center',
		top: 0
	},
	tooltip: {
		trigger: 'axis',
	},
	legend: {
		data: props.series.map((s) => s.name),
		top: 30,
	},
	xAxis: {
		type: 'category',
		data: xAxisData.value,
	},
	yAxis: {
		type: 'value',
		scale: true,
	},
	series: seriesData.value,
}))
</script>