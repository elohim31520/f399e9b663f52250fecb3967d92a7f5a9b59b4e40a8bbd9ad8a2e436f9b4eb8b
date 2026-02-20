<template>
    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border"
        :class="badgeClass">
        <span v-if="status === 'pending'" class="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        <span v-else class="w-1.5 h-1.5 rounded-full bg-current" />
        {{ label }}
    </span>
</template>

<script setup lang="ts">
import type { JobStatus } from '@/stores/aiTrade'

const props = defineProps<{ status?: JobStatus }>()

const label = computed(() => {
    switch (props.status) {
        case 'pending': return 'Pending'
        case 'success': return 'Success'
        case 'failed': return 'Failed'
        default: return 'Unknown'
    }
})

const badgeClass = computed(() => {
    switch (props.status) {
        case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        case 'success': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        case 'failed': return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        default: return 'bg-white/5 text-white/40 border-white/10'
    }
})
</script>