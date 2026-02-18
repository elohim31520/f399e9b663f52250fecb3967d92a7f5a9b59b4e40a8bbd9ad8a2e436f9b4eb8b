<template>
	<header class="w-full flex-y-center bg-white h-15 shadow-card-primary">
		<div class="bg-[url('/logo.webp')] bg-no-repeat bg-center bg-contain scale-up"
			style="height: 3.75rem; width: 7rem" @click="navigateTo(localePath('/'))"></div>
		<div @click.prevent="uiStore.showMenu" class="p-2 ml-auto mr-2.5">
			<SvgIcon name="icon_button_Menu" size="2rem" />
		</div>
	</header>
</template>

<script lang="ts" setup>
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const localePath = useLocalePath()
</script>

<style scoped>
.scale-up {
	background-size: 130%;
}
</style>
