<template>
	<div class="chart-container">
		<div class="flex-y-center justify-center font-[500] mb-1">
			{{ title }}
		</div>
		<div ref="chartRef" style="width: 100%; height: 400px"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts/core'
import type { StockMetrics } from '~/types/stockMetrics'

interface Props {
	title: string
	chartData: StockMetrics[]
	// 2. 優化：直接限制 Key 必須屬於 StockMetrics，後面就不用一直寫 as keyof
	xAxisKey: keyof StockMetrics
	firstSeriesKey: keyof StockMetrics
	secondSeriesKey: keyof StockMetrics
	firstSeriesName?: string
	secondSeriesName?: string
	firstSeriesColor?: string
	secondSeriesColor?: string
}

const {
	title,
	chartData,
	xAxisKey,
	firstSeriesKey,
	secondSeriesKey,
	firstSeriesName = '',
	secondSeriesName = '',
	firstSeriesColor = '#5470c6',
	secondSeriesColor = '#91cc75',
} = defineProps<Props>()

const chartRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const initChart = () => {
	if (!chartRef.value) return

	chartInstance.value = echarts.init(chartRef.value)
	updateChart()
}

const updateChart = () => {
	if (!chartInstance.value) return

	const xAxisData = chartData.map((item) => item[xAxisKey as keyof StockMetrics])
	const firstSeriesData = chartData.map((item) => item[firstSeriesKey as keyof StockMetrics])
	const secondSeriesData = chartData.map((item) => item[secondSeriesKey as keyof StockMetrics])

	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
			},
		},
		grid: {
			right: '20%',
		},
		legend: {
			data: [firstSeriesName || firstSeriesKey, secondSeriesName || secondSeriesKey],
		},
		xAxis: [
			{
				type: 'category',
				data: xAxisData,
				axisPointer: {
					type: 'shadow',
				},
			},
		],
		yAxis: [
			{
				type: 'value',
				name: firstSeriesName || firstSeriesKey,
				position: 'left',
			},
			{
				type: 'value',
				name: secondSeriesName || secondSeriesKey,
				position: 'right',
			},
		],
		series: [
			{
				name: firstSeriesName || firstSeriesKey,
				type: 'bar',
				data: firstSeriesData,
				itemStyle: {
					color: firstSeriesColor,
				},
			},
			{
				name: secondSeriesName || secondSeriesKey,
				type: 'bar',
				yAxisIndex: 1,
				data: secondSeriesData,
				itemStyle: {
					color: secondSeriesColor,
				},
			},
		],
	}

	chartInstance.value.setOption(option)
}

const handleResize = () => {
	chartInstance.value?.resize()
}

watch(
	() => chartData,
	() => {
		updateChart()
	},
	{ deep: true }
)

onMounted(() => {
	initChart()
	window.addEventListener('resize', handleResize)
})

// 處理組件銷毀時的清理
onBeforeUnmount(() => {
	if (chartInstance.value) {
		chartInstance.value.dispose()
		chartInstance.value = null
	}
})
onBeforeUnmount(() => {
	window.removeEventListener('resize', handleResize)
	if (chartInstance.value) {
		chartInstance.value.dispose()
		chartInstance.value = null
	}
})
</script>

<style scoped>
.chart-container {
	width: 100%;
	margin-bottom: 1rem;
}
</style>
