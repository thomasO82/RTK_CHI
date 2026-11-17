import { create } from 'zustand'
import { createRecipeSlice } from './slices/recipeSlice.js'
import { createIngredientSlice } from './slices/ingredientSlice.js'
export const useMealPlan = create((set) => {
  return {
    ...createRecipeSlice(set),
    ...createIngredientSlice(set),
  }
})
export function ingredientsForWeek(ingredients, now = new Date()) {
  const monday = new Date(now)
  const day = monday.getDay()
  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day))
  monday.setHours(0, 0, 0, 0)
  const nextMonday = new Date(monday)
  nextMonday.setDate(monday.getDate() + 7)
  return ingredients
    .filter((item) => {
      return item.date >= monday && item.date < nextMonday
    })
    .sort((a, b) => {
      return a.date - b.date
    })
}

export function getIngredients(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const name = meal['strIngredient' + i]?.trim()
    if (name) {
      ingredients.push({
        name,
        quantity: meal['strMeasure' + i]?.trim() || '',
      })
    }
  }
  return ingredients
}
