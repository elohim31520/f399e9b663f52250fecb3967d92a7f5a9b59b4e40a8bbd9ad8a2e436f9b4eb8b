import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent, MarkLineComponent, DataZoomComponent } from 'echarts/components'
import VChart from 'vue-echarts'

export default defineNuxtPlugin((nuxtApp) => {
	// 1. 註冊 ECharts 功能
	use([
		CanvasRenderer,
		LineChart,
		BarChart,
		GridComponent,
		TooltipComponent,
		TitleComponent,
		LegendComponent,
		MarkLineComponent,
		DataZoomComponent,
		PieChart
	])

	nuxtApp.vueApp.component('v-chart', VChart)
})
