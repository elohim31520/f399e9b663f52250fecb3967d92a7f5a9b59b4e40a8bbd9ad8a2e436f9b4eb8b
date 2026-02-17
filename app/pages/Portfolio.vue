<template>
	<div class="bg-white p-2">
		<div class="text-base font-bold mb-4 text-#656565">
			{{ $t('portfolio.my_portfolio') }}
		</div>

		<van-notice-bar v-if="!userStore.isLogin" wrapable :scrollable="false" type="warning" class="mb-2"
			:mode="'closeable'">
			{{ $t('portfolio.login_for_portfolio') }}
		</van-notice-bar>
		<van-notice-bar v-if="showNotice" left-icon="info-o" wrapable :scrollable="false" type="warning" class="mb-2"
			:mode="'closeable'" @close="showNotice = false">
			{{ $t('portfolio.notice') }}
		</van-notice-bar>

		<van-tabs v-model:active="activeTab" color="#F88379">
			<van-tab :title="$t('portfolio.holding_details')">
				<div v-if="portfolioStore.portfolioData.length > 0" class="mt-2">
					<van-cell-group>
						<van-swipe-cell v-for="item in portfolioStore.portfolioData" :key="item.stockSymbol"
							:right-width="65" :left-width="65" @close="(details) => onClose(details, item)">
							<van-cell>
								<template #title>
									<span class="font-bold">{{ item.stockSymbol }}</span>
									<span v-if="item.company?.name" class="text-gray-500 text-sm ml-2">
										{{ item.company.name }}
									</span>
								</template>
								<div>{{ $t('portfolio.quantity') }}: {{ item.quantity }}</div>
								<div>{{ $t('portfolio.average_price') }}: {{ item.averagePrice }}</div>
								<div>
									{{ $t('portfolio.total_value') }}:
									{{ formatNumber((item.quantity || 0) * (item.averagePrice || 0)) }}
								</div>
							</van-cell>
							<template #left>
								<div class="h-full flex items-center justify-center bg-primary text-white w-65px">
									{{ $t('portfolio.update') }}
								</div>
							</template>
							<template #right>
								<div class="h-full flex items-center justify-center bg-red-500 text-white w-65px">
									{{ $t('portfolio.delete') }}
								</div>
							</template>
						</van-swipe-cell>
					</van-cell-group>
				</div>
				<div v-else class="text-center text-gray-500 pt-2">
					{{ $t('portfolio.loading_or_no_holding') }}
				</div>
			</van-tab>
			<van-tab :title="$t('portfolio.chart_analysis')">
				<div class="w-full">
					<PortfolioChart ref="portfolioChartRef" />
				</div>
			</van-tab>
		</van-tabs>

		<TransactionFormPopup v-model="showUpdatePopup" :item="selectedItemForUpdate" @submit-success="onUpdateSuccess"
			:api-function="(payload) =>
				portfolioApi.updateMyPortfolio({
					stockSymbol: payload.stockSymbol,
					quantity: payload.quantity,
					averagePrice: payload.price,
				})
				" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onActivated } from 'vue'
import { showConfirmDialog, showToast } from 'vant'
import { usePortfolioStore } from '@/stores/portfolio'
import { portfolioApi } from '@/api/portfolio'
import { formatNumber } from '~/utils/util'
import type { PortfolioItem } from '@/types/portfolio'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const portfolioStore = usePortfolioStore()
const userStore = useUserStore()

const showNotice = ref(true)

defineOptions({
	name: 'portfolio',
})

interface PortfolioChartExposed {
	setChartOptions: (data: PortfolioItem[]) => void
}

const activeTab = ref(0)
const portfolioChartRef = ref<PortfolioChartExposed | null>(null)
const showUpdatePopup = ref(false)
const selectedItemForUpdate = ref<PortfolioItem | null>(null)
const isDataRefreshed = ref(false)

const onClose = (details: any, item: PortfolioItem) => {
	if (!userStore.isLogin) return
	const { position } = details

	switch (position) {
		case 'left':
			selectedItemForUpdate.value = item
			showUpdatePopup.value = true
			break
		case 'cell':
			break
		case 'right':
			showConfirmDialog({
				title: t('portfolio.confirm'),
				message: t('portfolio.confirm_delete'),
			})
				.then(() => {
					if (!item.id) {
						showToast(t('portfolio.missing_item_id'))
						return Promise.reject('Missing item id')
					}
					return portfolioApi.deleteMyPortfolio(item.id)
				})
				.then(() => {
					portfolioStore.fetchMyPortfolio()
					showToast(t('portfolio.delete_success'))
				})
			break
	}
}

const onUpdateSuccess = () => {
	portfolioStore.fetchMyPortfolio()
}

const fetchData = () => {
	if (userStore.isLogin) {
		portfolioStore.fetchMyPortfolio()
	} else {
		portfolioStore.fetchMockPortfolio()
	}
}

fetchData()

onActivated(() => {
	if (userStore.isLogin && !isDataRefreshed.value) {
		fetchData()
		isDataRefreshed.value = true
	}
})

watch(
	() => portfolioStore.portfolioData,
	(newData) => {
		if (newData && newData.length > 0 && portfolioChartRef.value) {
			portfolioChartRef.value.setChartOptions(newData)
		}
	},
	{ deep: true, immediate: true }
)
</script>
