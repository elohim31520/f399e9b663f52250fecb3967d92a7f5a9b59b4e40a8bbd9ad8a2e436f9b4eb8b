<template>
	<van-popup :show="uiStore.isMenuShown" @update:show="uiStore.isMenuShown = $event" position="left"
		:style="{ width: '80%', height: '100%' }" z-index="99">
		<div class="pt-5">
			<nav class="flex flex-col gap-y-2">
				<template v-for="item in menuItems" :key="item.to">
					<NuxtLink v-if="
						item.auth === 'always' ||
						(item.auth === 'auth' && userStore.isLogin) ||
						(item.auth === 'guest' && !userStore.isLogin)
					" :to="localePath(item.to)" @click="closeMenu"
						class="flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
						active-class="text-primary">
						<SvgIcon :name="item.icon" size="1.2rem" class="mr-5" />
						<span class="text-xl">{{ $t(item.text) }}</span>
					</NuxtLink>
				</template>
				<div v-if="userStore.isLogin" @click="logout"
					class="flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
					active-class="text-primary">
					<SvgIcon name="icon_quit" size="1.2rem" class="mr-5" />
					<span class="text-xl">{{ $t('sidemenu.logout') }}</span>
				</div>
			</nav>
		</div>
	</van-popup>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'

const localePath = useLocalePath()
const uiStore = useUIStore()
const userStore = useUserStore()

const menuItems = [
	{ to: '/', icon: 'icon_settings_Name2', text: 'sidemenu.home', auth: 'always' },
	{ to: '/add-transaction', icon: 'icon_menu_Opinion', text: 'sidemenu.add_record', auth: 'always' },
	{ to: '/records', icon: 'money', text: 'sidemenu.my_records', auth: 'always' },
	{
		to: '/portfolio',
		icon: 'icon_gift',
		text: 'sidemenu.my_portfolio',
		auth: 'always',
	},
	{
		to: '/companies',
		icon: 'icon_menu_Query',
		text: 'sidemenu.stock_list',
		auth: 'always',
	},
	{
		to: '/m7',
		icon: 'side-bar-no1',
		text: 'sidemenu.m7',
		auth: 'always',
	},
	{ to: '/market-metrics', icon: 'media', text: 'sidemenu.market_indicators', auth: 'always' },
	{ to: '/volatile-stock', icon: 'icon_ghost', text: 'sidemenu.todays_volatility', auth: 'always' },
	{ to: '/login', icon: 'icon_user2', text: 'sidemenu.login', auth: 'guest' },
	{ to: '/register', icon: 'icon_settings_invite', text: 'sidemenu.register', auth: 'guest' },
	{ to: '/monte-carlo-simulation', icon: 'icon_button_system', text: 'monte-sim.menu', auth: 'always' },
]

const closeMenu = () => {
	uiStore.hideMenu()
}

const logout = async () => {
	closeMenu()
	userStore.logout()
	await navigateTo(localePath('/login'))
	window.location.reload()
}
</script>

<style scoped lang="scss"></style>
