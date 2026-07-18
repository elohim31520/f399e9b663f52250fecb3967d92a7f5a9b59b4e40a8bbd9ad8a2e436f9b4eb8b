<template>
	<div class="h-[calc(100vh*2/3)] w-[100%]" :class="{ 'pointer-events-none': props.disabled }">
		<div id="tradingview_12345" class="w-full h-full"></div>
		<div class="tradingview-widget-copyright">
			<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
				<span class="blue-text">Track all markets on TradingView</span>
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const props = defineProps<{
	symbol: string
	symbolPrefix?: string
	disabled?: boolean
}>()

onMounted(() => {
	const script = document.createElement('script')
	script.src = 'https://s3.tradingview.com/tv.js'
	script.async = true
	script.onload = () => {
		new window.TradingView.widget({
			autosize: true,
			symbol: `${props.symbolPrefix ? props.symbolPrefix : 'NASDAQ'}:${props.symbol}`,
			interval: 'D',
			timezone: 'Etc/UTC',
			theme: 'light',
			style: '1',
			locale: locale.value === 'zh' ? 'zh_TW' : 'en',
			enable_publishing: false,
			allow_symbol_change: true,
			container_id: 'tradingview_12345',
		})
	}
	document.body.appendChild(script)
})
</script>