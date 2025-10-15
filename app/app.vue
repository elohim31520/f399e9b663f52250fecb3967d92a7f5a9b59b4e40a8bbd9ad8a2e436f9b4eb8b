<template>
	<div class="min-h-screen flex flex-col max-w-[480px] mx-auto bg-gray-100 pb-[6rem]">
		<AppHeader class="mb-2" v-if="showHeader" />

		<SideMenu />

		<main class="flex-grow">
			<NuxtRouteAnnouncer />
			<NuxtPage />
		</main>

		<Footer />
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted } from 'vue'
	import { useRoute } from 'vue-router'
	const route = useRoute()

	function loadGoogleAdScript() {
		if (import.meta.server) return
		const script = document.createElement('script')
		script.async = true
		script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3738209519931286'
		script.crossOrigin = 'anonymous'
		document.head.appendChild(script)
	}

	const showHeader = computed(() => {
		if (['/my', '/my/'].includes(route.path)) return false
		return true
	})

	onMounted(() => {
		loadGoogleAdScript()
	})
</script>
