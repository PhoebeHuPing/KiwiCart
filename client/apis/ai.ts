import request from 'superagent'
import { MealPlanResponse } from '../../models/products'
import { buildApiUrl } from './apiBaseUrl'

/**
 * Requests an AI meal plan for a plain-language prompt. The backend uses
 * Gemini to extract ingredients, then prices each across supermarkets and
 * returns the cheapest match per ingredient plus an estimated total.
 *
 * The endpoint is rate-limited (HTTP 429) and returns 502 if the AI provider
 * is unavailable; callers should surface those to the user.
 */
export async function getMealPlan(prompt: string): Promise<MealPlanResponse> {
  const response = await request
    .post(buildApiUrl('/v1/ai/meal-plan'))
    .send({ prompt })
  return response.body
}
