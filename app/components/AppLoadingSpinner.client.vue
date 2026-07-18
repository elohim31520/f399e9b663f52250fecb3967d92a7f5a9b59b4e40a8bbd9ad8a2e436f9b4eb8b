<template>
    <Transition name="fade">
        <div v-if="isLoading"
            class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div class="spinner" />
        </div>
    </Transition>
</template>

<script lang="ts" setup>
const { isLoading } = useLoadingIndicator()
</script>

<style scoped>
.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #F88379;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>