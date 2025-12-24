<template>
	<div class="grid grid-cols-1 gap-1 px-1 mt-2">
		<h1 class="text-lg font-bold flex-center">{{ $t('market_quotes.title') }}</h1>
		<div>
			<ul>
				<li
					v-for="(item, index) in fetchedData"
					:key="index"
					class="flex items-center py-5 px-2 shadow-card-primary gap-1"
				>
					<span class="text-gray-600">{{ getSymbolName(item.symbol) }}</span>
					<span class="text-primary-600 ml-auto">{{ item.price }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
	const { $api } = useNuxtApp()

	const symbolNameMap: Record<string, string> = {
		BTCUSD: $t('market_quotes.btcusd'),
		DXY: $t('market_quotes.dxy'),
		USOIL: $t('market_quotes.usoil'),
		US10Y: $t('market_quotes.us10y'),
		XAUUSD: $t('market_quotes.xauusd'),
	}

	// 取得 symbol 的中文名稱
	const getSymbolName = (symbol: string): string => {
		return symbolNameMap[symbol] || symbol
	}

	const {
		data: fetchedData,
		pending,
		error,
	} = await useAsyncData(
		'market-quotes-data',
		async () => {
			const res = await $api.market.getQuotes()
			return _get(res, 'data', [])
		},
		{
			default: () => [],
		}
	)
</script>
