<template>
	<div class="simulator-container">
		<div class="controls">
			<div class="input-group">
				<label>{{ $t('monte-sim.selectStock') }}:</label>
				<van-dropdown-menu>
					<van-dropdown-item
						v-model="selectedSymbol"
						:options="stockOptions"
						@change="handleStockChange"
						:placeholder="$t('monte-sim.placeholder')"
					/>
				</van-dropdown-menu>
			</div>

			<div class="input-group">
				<label>{{ $t('monte-sim.initialPrice') }}:</label>
				<input type="number" v-model="params.s0" />
			</div>

			<div class="input-group slider-group">
				<div class="label-row">
					<label>{{ $t('monte-sim.volatility') }}:</label>
					<span class="font-bold text-primary-600">{{ (params.sigma * 100).toFixed(0) }}%</span>
				</div>

				<div class="slider-wrapper">
					<van-slider
						v-model="params.sigma"
						:min="0.01"
						:max="1.0"
						:step="0.01"
						bar-height="4px"
						active-color="#F88379"
						@change="runSimulation"
					/>
				</div>
			</div>
			<van-button type="primary" @click="runSimulation" :disabled="isCalculating" color="#F88379">
				{{ isCalculating ? $t('monte-sim.calculating') : $t('monte-sim.runSimulation') }}
			</van-button>
		</div>

		<ClientOnly>
			<div style="height: 500px">
				<v-chart :option="chartOption" autoresize />
			</div>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, onUnmounted, ref, shallowRef, computed } from 'vue'
	import type { SimulationParams, SimulationResult } from '~/workers/simulation.worker'
	const { $api } = useNuxtApp()

	const chartContainer = ref<HTMLElement | null>(null)
	const isCalculating = ref(false)
	const chartOption = shallowRef<any>(null)

	let worker: Worker | null = null
	const stockPrices = ref<any[]>([])
	const selectedSymbol = ref('')
	// 模擬參數 (與你之前的設定一致)
	const params = ref<SimulationParams>({
		s0: 1,
		mu: 0.1,
		sigma: 0.25,
		t: 1,
		n_steps: 252,
		n_simulations: 10000,
	})

	const stockOptions = computed(() => {
		return stockPrices.value.map((item) => ({
			text: `${item.name} (${item.symbol ? item.symbol : '-'})`,
			value: item.symbol,
		}))
	})

	onMounted(() => {
		// 確保只在客戶端初始化 Worker
		worker = new Worker(new URL('../workers/simulation.worker.ts', import.meta.url), {
			type: 'module',
		})

		worker.onmessage = (e: MessageEvent<SimulationResult>) => {
			chartOption.value = getOption(e.data)
			isCalculating.value = false
		}

		$api.stock.getTodayStocks().then((res) => {
			stockPrices.value = res.data
			if (res.data.length > 0) {
				selectedSymbol.value = res.data.find((vo) => vo.symbol == 'TSLA')?.symbol
				handleStockChange(selectedSymbol.value)
			}
		})
	})

	const handleStockChange = (symbol: string) => {
		const stock = stockPrices.value.find((s) => s.symbol === symbol)
		if (stock) {
			params.value.s0 = parseFloat(stock.price)
			runSimulation()
		}
	}

	onUnmounted(() => {
		worker?.terminate()
	})

	const runSimulation = () => {
		if (isCalculating.value || !worker) return
		isCalculating.value = true
		worker.postMessage(JSON.parse(JSON.stringify(params.value)))
	}

	const getOption = (data: SimulationResult) => {
		return {
			title: { text: $t('monte-sim.chartTitle'), left: 'center' },
			tooltip: { trigger: 'axis' },
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: Array.from({ length: params.value.n_steps + 1 }, (_, i) => i),
			},
			yAxis: { type: 'value', scale: true },
			series: data.samplePaths.map((path, idx) => ({
				type: 'line',
				data: path,
				showSymbol: false,
				lineStyle: { width: 1, opacity: 0.2, color: '#409EFE' },
				// 大數據優化
				sampling: 'lttb',
			})),
		}
	}
</script>

<style scoped>
	.controls {
		display: flex;
		gap: 20px;
		align-items: center;
		padding: 20px;
		background: #f8f9fa;
		flex-wrap: wrap;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
		min-width: 150px;
	}

	/* 調整 Vant 下拉選單寬度使其整齊 */
	:deep(.van-dropdown-menu__bar) {
		height: 40px;
		box-shadow: none;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
	}

	.slider-group {
		min-width: 200px;
		padding: 10px 0;
	}

	.label-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;
		font-size: 14px;
	}

	.slider-wrapper {
		padding: 0 10px;
	}
</style>
