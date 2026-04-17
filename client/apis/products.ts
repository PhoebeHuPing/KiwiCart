import request from 'superagent'

const rootURL = '/api/v1/products'

// 获取所有商品
export async function getProducts() {
  const response = await request.get(rootURL)
  return response.body
}

// 核心比价搜索接口
export async function getComparePrices(searchTerm: string) {
  const response = await request
    .get(`${rootURL}/compare`)
    .query({ q: searchTerm })
  return response.body
}

// 模拟获取单个商品的详细信息（目前为空）
export async function getProductById(id: number) {
  const response = await request.get(`${rootURL}/${id}`)
  return response.body
}
