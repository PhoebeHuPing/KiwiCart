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

export async function getSupermarkets() {
  return db('supermarkets').select('*')
}

export async function getNearbySupermarkets(
  lat: number,
  lng: number,
  radiusKm: number,
) {
  const allStores = await db('supermarkets').select('*')
  return allStores.filter((store) => {
    const distance = calculateDistance(lat, lng, store.lat, store.lng)
    return distance <= radiusKm
  })
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

export async function deleteProductById(id: number): Promise<number> {
  return db('products').where('id', id).delete()
}
