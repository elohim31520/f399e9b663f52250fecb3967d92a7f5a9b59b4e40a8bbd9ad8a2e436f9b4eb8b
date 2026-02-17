// 创建/更新投资组合的参数类型
export interface NewPortfolio {
	stockSymbol: string;
	quantity?: number;
	averagePrice?: number;
}

// 查询返回的 company 类型
type CompanyInfo = {
	name: string | null;
	symbol: string | null;
} | null;

// 基础 Portfolio 接口
export interface Portfolio {
	id?: number;
	stockSymbol: string;
	quantity?: number;
	averagePrice?: number;
}

// 带公司信息的 Portfolio 返回类型
export interface PortfolioWithCompany extends Portfolio {
	company: CompanyInfo;
}

// 为了向后兼容，保留 PortfolioItem 作为 PortfolioWithCompany 的别名
export type PortfolioItem = PortfolioWithCompany;
