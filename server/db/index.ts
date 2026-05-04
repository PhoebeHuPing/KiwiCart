import db from './connection.ts'
import { Product, PriceComparisonData } from '../../models/products'

export async function getProducts(): Promise<Product[]> {
  return db('products').select('*')
}

export async function getComparePrices(
  searchTerm: string,
): Promise<PriceComparisonData[]> {
  return db('products')
    .join('prices', 'products.id', 'prices.product_id')
    .join('supermarkets', 'supermarkets.id', 'prices.supermarket_id')
    .select(
      'products.name as product_name',
      'products.image_url',
      'supermarkets.name as supermarket_name',
      'supermarkets.logo_url',
      'supermarkets.address',
      'supermarkets.lat',
      'supermarkets.lng',
      'prices.price',
    )
    .where('products.name', 'like', `%${searchTerm}%`)
    .orderBy('prices.price', 'asc')
}

export async function deleteProductById(id: number): Promise<number> {
  return db('products').where('id', id).delete()
}
