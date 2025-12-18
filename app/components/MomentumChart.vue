<template>
	<div class="p-1 bg-white rounded-lg shadow-primary">
		<div class="flex justify-center gap-5 my-5">
			<div
				v-for="day in timeRanges"
				:key="day"
				@click="refreshData(day)"
				:class="[
					'px-2 py-2 rounded-md w-[3rem] text-center',
					selectedDays === day ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
				]"
			>
				{{ $t('momentum_chart.days_unit', { count: day }) }}
			</div>
		</div>

		<ClientOnly>
			<div class="h-[400px]">
				<v-chart class="chart" :option="option" autoresize />
			</div>
		</ClientOnly>

		<div class="text-gray-500 p-2">
			<div class="mb-2">
				{{ $t('momentum_chart.tips') }}
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import { use } from 'echarts/core'
	import { CanvasRenderer } from 'echarts/renderers'
	import { BarChart } from 'echarts/charts'
	import { TitleComponent, TooltipComponent, GridComponent, DataZoomComponent } from 'echarts/components'
	import VChart from 'vue-echarts'
	import { useRouter } from 'vue-router'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()
	const router = useRouter()
	const { isLogin } = useAuth()
	const { $api } = useNuxtApp()

	use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent, DataZoomComponent])

	const timeRanges = [1, 3, 7, 30]
	const selectedDays = ref<number>(1)

	interface chartData {
		ct: string
		v: number
	}
	const momentumData = ref<chartData[]>([])

	const option = computed(() => {
		const dates = momentumData.value.map((item: chartData) => item.ct)
		const volumes = momentumData.value.map((item: chartData) => item.v)

		return {
			title: {
				text: t('momentum_chart.title', { days: selectedDays.value }),
				left: 'center',
			},
			tooltip: {
				trigger: 'axis',
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true,
			},
			xAxis: {
				type: 'category',
				data: dates,
			},
			yAxis: {
				type: 'value',
			},
			series: [
				{
					data: volumes,
					type: 'bar',
					itemStyle: {
						color: '#f472b6',
					},
					animationDelay: function (idx: number) {
						const days = selectedDays.value
						const baseDelay = days >= 30 ? 2 : days >= 7 ? 10 : 50
						return idx * baseDelay
					},
					animationDelayUpdate: function (idx: number) {
						const days = selectedDays.value
						const baseDelay = days >= 30 ? 2 : days >= 7 ? 10 : 50
						return idx * baseDelay
					},
				},
			],
			animation: true,
			animationDuration: 1000,
			animationEasing: 'cubicOut',
		}
	})

	const fetchData = async (days: number): Promise<chartData[]> => {
		try {
			const res = await $api.market.getMomentumByRange(days)
			return res.data
		} catch (error) {
			console.error(`Failed to fetch ${days}-day momentum data:`, error)
			return []
		}
	}

	// 其他天數資料會從cloudflare KV中間件會 跟api server做用戶驗證
	const refreshData = async (days: number): Promise<void> => {
		selectedDays.value = days
		if (!isLogin.value && selectedDays.value !== 1) {
			router.push('/login')
			return
		}
		const data = await fetchData(days)
	}

	const {
		data: fetchedData,
		pending,
		error,
	} = await useAsyncData(
		'market-momentum-data',
		() => {
			if (selectedDays.value === 1) {
				return fetchData(1)
			}

			return fetchData(1)
		},
		{
			// 只在需要時才執行
			lazy: true,
		}
	)
	if (fetchedData.value) momentumData.value = fetchedData.value

	watch(
		fetchedData,
		(newData) => {
			if (newData) {
				momentumData.value = newData
			}
		},
		{ immediate: true }
	)
</script>
