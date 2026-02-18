<template>
	<div>
		<van-empty image="error" description="您訪問的頁面不存在" class="mt-2" />

		<div class="flex-center">
			<van-button type="default" size="small" @click="redirect('/')">返回首页</van-button>
		</div>
	</div>
</template>
<script setup lang="ts">
const localePath = useLocalePath()

function redirect(path: string) {
	navigateTo(localePath(path))
}
</script>
