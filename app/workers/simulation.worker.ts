export interface SimulationParams {
	s0: number
	mu: number
	sigma: number
	t: number
	n_steps: number
	n_simulations: number
}

export interface SimulationResult {
	samplePaths: number[][]
	meanFinalPrice: number
	profitProbability: number
}

const ctx: Worker = self as any

ctx.onmessage = (e: MessageEvent<SimulationParams>) => {
	const { s0, mu, sigma, t, n_steps, n_simulations } = e.data
	const dt = t / n_steps

	const allPaths: number[][] = []
	const finalPrices: number[] = []

	// Box-Muller 隨機數生成器
	const rnorm = (): number => {
		let u = 0,
			v = 0
		while (u === 0) u = Math.random()
		while (v === 0) v = Math.random()
		return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
	}

	for (let s = 0; s < n_simulations; s++) {
		let currentPrice = s0
		let path: number[] = [s0]

		for (let i = 0; i < n_steps; i++) {
			const z = rnorm()
			// GBM 公式：$S_t = S_{t-1} \times e^{(\mu - 0.5\sigma^2)dt + \sigma\sqrt{dt} \cdot z}$
			const drift = (mu - 0.5 * Math.pow(sigma, 2)) * dt
			const shock = sigma * Math.sqrt(dt) * z
			currentPrice *= Math.exp(drift + shock)

			if (s < 50) path.push(currentPrice) // 只存前 50 條畫圖用
		}

		if (s < 50) allPaths.push(path)
		finalPrices.push(currentPrice)
	}

	const result: SimulationResult = {
		samplePaths: allPaths,
		meanFinalPrice: finalPrices.reduce((a, b) => a + b) / n_simulations,
		profitProbability: finalPrices.filter((p) => p > s0).length / n_simulations,
	}

	ctx.postMessage(result)
}
