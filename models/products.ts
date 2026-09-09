/**
 * Represents a base product entity in the system.
 */
export interface Product {
  id: number
  name: string
  category: string
  image_url: string
}

/**
 * Represents a supermarket brand and its physical location details.
 */
export interface Supermarket {
  id: number
  name: string
  logo_url: string
  address: string
  lat: number
  lng: number
}

/**
 * Data structure for a single product price at a specific supermarket.
 * Used for the main search results list.
 */
export interface PriceComparisonData {
  product_name: string
  image_url: string
  supermarket_name: string
  logo_url: string
  address: string
  lat: number
  lng: number
  price: number
  unit_price?: string // Calculated value (e.g., "$2.50/kg")
}

/**
 * Summary of a full basket's cost at a specific supermarket.
 */
export interface BasketComparisonResult {
  supermarket_name: string
  logo_url: string
  total_price: number
  items_found: number
  missing_items: string[]
  details: {
    name: string
    price: number
    quantity: number
    subtotal: number
  }[]
}

/**
 * One ingredient extracted by the AI meal-plan assistant, paired with the
 * cheapest matching product across supermarkets (null when no match found).
 * Mirrors the backend `MealPlanItem` DTO.
 */
export interface MealPlanItem {
  ingredient: string
  cheapest: PriceComparisonData | null
}

/**
 * Result of an AI meal plan: the extracted ingredients with their cheapest
 * matches, plus the sum of those cheapest prices. Mirrors the backend
 * `MealPlanResponse` DTO (`POST /api/v1/ai/meal-plan`).
 */
export interface MealPlanResponse {
  items: MealPlanItem[]
  estimated_total: number
}
