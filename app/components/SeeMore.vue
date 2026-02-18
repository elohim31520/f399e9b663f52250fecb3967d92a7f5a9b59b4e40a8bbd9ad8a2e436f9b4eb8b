<template>
	<div class="flex-y-center justify-center text-primary" @click="handleClick" v-bind="$attrs">
		{{ $t('see_more.text') }}
		<SvgIcon name="icon_arrow_right" size="1rem" />
	</div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

const props = defineProps<{
	to: string
}>()

const handleClick = () => {
	navigateTo(localePath(props.to))
}
</script>
