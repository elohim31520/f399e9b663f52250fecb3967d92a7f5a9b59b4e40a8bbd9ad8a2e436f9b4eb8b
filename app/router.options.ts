import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
	scrollBehavior(to, from, savedPosition) {
		// 如果有保存的位置（按返回鍵），使用保存的位置
		if (savedPosition) {
			return savedPosition
		}

		// 如果有錨點，滾動到錨點
		if (to.hash) {
			return {
				el: to.hash,
				behavior: 'auto',
			}
		}

		// 否則瞬間滾動到頂部
		return { top: 0 }
	},
}
