<template>
	<v-chart class="chart" :style="{ height }" :option="option" autoresize />
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import type { StockMetrics } from '~/types/stockMetrics'

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

provide(THEME_KEY, '#fff')

const {
	title,
	lineColor,
	chartData,
	height = '400px',
	xAxisKey,
	seriesKey,
} = defineProps<{
	title: string
	lineColor?: string
	chartData: StockMetrics[]
	height?: string
	xAxisKey?: string
	seriesKey?: string
}>()

const xAxisData = computed(() => {
	return chartData.map((item) => new Date(item[xAxisKey as keyof typeof item]).toLocaleDateString())
})

const seriesData = computed(() => {
	return chartData.map((item) => parseFloat(item[seriesKey as keyof typeof item] as string))
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
	},
	yAxis: {
		type: 'value',
		scale: true,
	},
	series: [
		{
			type: 'bar',
			data: seriesData.value,
			itemStyle: {
				color: lineColor || '#F88379',
			},
		},
	],
}))
</script>
