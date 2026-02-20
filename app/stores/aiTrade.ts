import { defineStore } from 'pinia'
import { showNotify } from 'vant'
import { transactionApi } from '../api/transaction'

export type JobStatus = 'pending' | 'success' | 'failed'

export interface TradeJob {
    jobId: string
    status: JobStatus
    message?: string
    createdAt: number
    updatedAt: number
}

interface AiTradeState {
    jobs: Record<string, TradeJob>
    pollingTimers: Record<string, ReturnType<typeof setInterval>>
    activePageJobId: string | null // 當前頁面正在查看的 jobId
}

export const useAiTradeStore = defineStore('aiTrade', {
    state: (): AiTradeState => ({
        jobs: {},
        pollingTimers: {},
        activePageJobId: null,
    }),

    getters: {
        getJob: (state) => (jobId: string): TradeJob | undefined => state.jobs[jobId],

        pendingJobs: (state): TradeJob[] =>
            Object.values(state.jobs).filter((j) => j.status === 'pending'),

        completedJobs: (state): TradeJob[] =>
            Object.values(state.jobs).filter((j) => j.status !== 'pending'),
    },

    actions: {
        /**
         * 新增一個 job 並開始輪詢
         * @param jobId - 後端回傳的 jobId
         * @param interval - 輪詢間隔（ms），預設 10000
         */
        startTracking(jobId: string, interval = 10000) {
            // 避免重複追蹤
            if (this.pollingTimers[jobId]) return

            // 初始化 job 狀態
            this.jobs[jobId] = {
                jobId,
                status: 'pending',
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }

            this._fetchJobStatus(jobId)

            // 開始輪詢
            const timer = setInterval(() => {
                this._fetchJobStatus(jobId)
            }, interval)

            this.pollingTimers[jobId] = timer
        },

        stopTracking(jobId: string) {
            if (this.pollingTimers[jobId]) {
                clearInterval(this.pollingTimers[jobId])
                delete this.pollingTimers[jobId]
            }
        },

        stopAll() {
            Object.keys(this.pollingTimers).forEach((id) => this.stopTracking(id))
        },

        setActivePageJobId(jobId: string | null) {
            this.activePageJobId = jobId
        },

        removeJob(jobId: string) {
            this.stopTracking(jobId)
            delete this.jobs[jobId]
        },

        async _fetchJobStatus(jobId: string) {
            try {
                const res = await transactionApi.getTradeJobStatus(jobId)
                const data = res.data
                console.log(data);

                const prev = this.jobs[jobId]
                const wasCompleted = prev?.status !== 'pending'

                this.jobs[jobId] = {
                    ...prev,
                    jobId,
                    status: data.status,
                    message: data.message,
                    updatedAt: Date.now(),
                }

                // 如果狀態從 pending 變成 success/failed，停止輪詢並通知
                if (!wasCompleted && data.status !== 'pending') {
                    this.stopTracking(jobId)
                    this._notify(jobId, data.status, data.message)
                }
            } catch (err) {
                console.error(`[aiTradeStore] Failed to fetch status for ${jobId}:`, err)
            }
        },

        _notify(jobId: string, status: JobStatus, message?: string) {
            // 若當前就在這個 job 的頁面，不彈出通知（頁面自己會更新）
            if (this.activePageJobId === jobId) return

            if (status === 'success') {
                showNotify({
                    type: 'success',
                    message,
                    duration: 4000,
                })
            } else if (status === 'failed') {
                showNotify({
                    type: 'danger',
                    message,
                    duration: 5000,
                })
            }
        },
    },
})