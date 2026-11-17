import { create } from 'zustand'
import { createRecipeSlice } from './slices/recipeSlice.js'
import { createIngredientSlice } from './slices/ingredientSlice.js'
export { selectPlanRecipe } from './slices/recipeSlice.js'

export const useMealPlan = create((set) => {
  return {
    ...createRecipeSlice(set),
    ...createIngredientSlice(set),
  }
})
