import request from 'superagent'
import { Product, PriceComparisonData } from '../../models/products'

const rootURL = '/api/v1/products'

// 获取所有商品
export async function getProducts(): Promise<Product[]> {
  const response = await request.get(rootURL)
  return response.body
}

// 核心比价搜索接口
export async function getComparePrices(
  searchTerm: string,
): Promise<PriceComparisonData[]> {
  const response = await request
    .get(`${rootURL}/compare`)
    .query({ q: searchTerm })
  return response.body
}

export async function getSupermarkets() {
  const response = await request.get(`${rootURL}/supermarkets`)
  return response.body
}

export async function getNearbySupermarkets(
  lat: number,
  lng: number,
  radius = 5,
) {
  const response = await request
    .get(`${rootURL}/nearby`)
    .query({ lat, lng, radius })
  return response.body
}

// 模拟获取单个商品的详细信息（目前为空）
export async function getProductById(id: number): Promise<Product> {
  const response = await request.get(`${rootURL}/${id}`)
  return response.body
}
