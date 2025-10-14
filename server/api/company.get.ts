import { defineEventHandler } from 'h3'
import { stockApi } from '../../app/api/stock'

export default defineEventHandler(async () => {
  const res = await stockApi.getCompanySymbols()
  return res.data
})
