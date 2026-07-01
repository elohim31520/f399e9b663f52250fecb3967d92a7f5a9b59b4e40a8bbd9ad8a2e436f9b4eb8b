import { defineStore } from 'pinia'
import type { BalanceInfo } from '@/types/balance'

export const useBalanceStore = defineStore('balance', {
	state: () => ({
		usdInfo: null as BalanceInfo | null,
	}),
	getters: {
		usdBalance: (state) => state.usdInfo?.balance ?? 0,
	},
	actions: {
		async fetchMyBalance() {
			const { isAuthenticated } = useAuth()
			if (!isAuthenticated.value) return
			try {
				const { $bffApi } = useNuxtApp()
				const res = await $bffApi.getMyBalances()
				const usdData = _get(res, 'data')
				if (usdData) {
					this.usdInfo = usdData
				} else {
					this.usdInfo = null
				}
			} catch (error) {
				console.error('Failed to fetch balance data:', error)
				this.usdInfo = null
			}
		},
	},
})
