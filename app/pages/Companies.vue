<template>
	<div class="bg-white shadow-card-primary">
		<div class="text-xl font-bold p-2">{{ $t('companies.title') }}</div>

		<van-index-bar :index-list="indexList">
			<template v-for="(group, letter) in groupedCompanies" :key="letter">
				<van-index-anchor :index="letter" />
				<div v-for="company in group" :key="company.symbol" class="flex-y-center justify-between">
					<div class="w-full flex-y-center text-#434343 h-[3.75rem] px-1 shadow-card-primary gap-5"
						@click="handleClick(company.symbol)">
						<CompanyIcon :symbol="company.symbol" />
						<div class="text-primary font-bold">{{ company.symbol }}</div>
						<div class="ml-2 text-sm">{{ company.name }}</div>
					</div>
				</div>
			</template>
		</van-index-bar>

		<van-back-top right="1rem" bottom="3.5rem" />
	</div>
</template>

<script setup lang="ts">
import type { Company } from '../types/api'

const localePath = useLocalePath()
const { $api } = useNuxtApp()

defineOptions({
	name: 'companies',
})

const { data: companies } = await useAsyncData<Company[]>('company-symbols', async () => {
	const res = await $api.stock.getCompanySymbols()
	return res.data
})

const groupedCompanies = computed(() => {
	if (!companies.value) return {}

	return companies.value.reduce((acc, company) => {
		const letter = company.symbol?.[0]?.toUpperCase() ?? '#'
		if (!acc[letter]) acc[letter] = []
		acc[letter]?.push(company)
		return acc
	}, {} as Record<string, Company[]>)
})

const indexList = computed(() => {
	return Object.keys(groupedCompanies.value).sort()
})

const handleClick = (symbol: string) => {
	navigateTo(localePath(`/company-metrics/${symbol}`))
}
</script>