import { create } from 'zustand'
import { createRecipeSlice } from './slices/recipeSlice.js'
import { createIngredientSlice } from './slices/ingredientSlice.js'

export const useMealPlan = create((set) => {
  return {
    ...createRecipeSlice(set),
    ...createIngredientSlice(set),
  }
})
