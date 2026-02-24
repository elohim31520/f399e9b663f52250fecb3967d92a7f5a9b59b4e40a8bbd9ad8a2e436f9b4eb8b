<template>
    <div class="min-h-screen bg-slate-50">
        <!-- Header -->
        <div
            class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-3">
            <div class="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-[#F88379]" />
            <h1 class="text-lg font-bold text-slate-800 tracking-tight">{{ t('news.title') }}</h1>
        </div>

        <Waterfall ref="waterfallRef" dataPath="data.rows" :apiFunction="(params) => $api.news.getNews(params)">
            <template #default="{ list }">
                <div class="news-list px-4 pb-6 pt-4 space-y-4">
                    <article v-for="item in list" :key="item.id"
                        class="news-card group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-transform duration-150 active:scale-[0.98]">
                        <div class="h-1 w-full bg-gradient-to-r from-pink-500 via-orange-400 to-[#F88379]" />
                        <div class="p-4">
                            <!-- 標籤 + 時間 -->
                            <div class="flex items-center justify-between mb-3">
                                <span
                                    class="inline-flex items-center gap-1 text-[11px] font-semibold tracking-widest uppercase text-primary bg-amber-50 px-2 py-0.5 rounded-full border border-[#F88379]">
                                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    News
                                </span>
                                <time class="text-[11px] text-slate-400 tabular-nums">
                                    {{ formatDate(item.createdAt) }}
                                </time>
                            </div>

                            <!-- 內文：van-text-ellipsis 展開/收合 -->
                            <van-text-ellipsis :content="isZh ? item.content : item.contentEn" rows="4"
                                :expand-text="$t('com.expand')" :collapse-text="$t('com.collapse')"
                                class="text-[14px] leading-relaxed text-slate-700 font-medium" />

                            <!-- 底部資訊 -->
                            <div class="flex items-center mt-4 pt-3 border-t border-slate-100">
                                <div class="flex items-center gap-1.5 text-slate-400">
                                    <van-icon name="eye-o" size="14" />
                                    <span class="text-xs">{{ _random(100, 10000) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- 置頂 badge -->
                        <div v-if="item.isTop"
                            class="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                            Top
                        </div>
                    </article>
                </div>
            </template>
        </Waterfall>
    </div>
</template>

<script setup>
import { format } from 'date-fns'

const { $api } = useNuxtApp()
const { locale, t } = useI18n()

const waterfallRef = ref(null)

const isZh = computed(() => locale.value.startsWith('zh'))

const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return format(new Date(dateStr), 'yyyy/MM/dd')
}
</script>