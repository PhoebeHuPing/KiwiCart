export interface Product {
  id: number
  name: string
  category: string
  image_url: string
}

export interface Supermarket {
  id: number
  name: string
  logo_url: string
  address: string
  lat: number
  lng: number
}

export interface PriceComparisonData {
  product_name: string
  image_url: string
  supermarket_name: string
  logo_url: string
  address: string
  lat: number
  lng: number
  price: number
}
