<template>
	<div class="bg-white p-2 shadow-card-primary">
		<div class="text-xl font-bold">{{ $t('companies.title') }}</div>
		<div v-for="(company, index) in companies" :key="index" class="flex-y-center justify-between">
			<div
				class="w-full flex-y-center text-#434343 h-[3.75rem] px-1 shadow-card-primary gap-5"
				@click="handleClick(company.symbol)"
			>
				<CompanyIcon :symbol="company.symbol" />
				<div>{{ company.symbol }}</div>
				<div class="ml-auto">{{ company.name }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import type { Company } from '../types/api'
	import { useRouter } from 'vue-router'

	const router = useRouter()
	const { $api } = useNuxtApp()

	defineOptions({
		name: 'companies',
	})

	const { data: companies } = await useAsyncData<Company[]>('company-symbols', async () => {
		const res = await $api.stock.getCompanySymbols()
		return res.data
	})

	const handleClick = (symbol: string) => {
		router.push(`/company-metrics/${symbol}`)
	}
</script>
