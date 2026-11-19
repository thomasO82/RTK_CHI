import {
  getCategories,
  getRecipesByCategory,
  getRecipesBySearch,
  getRecipeById,
} from '../services/theMealDbApi.js'

export const categoriesQuery = () => ({
  queryKey: ['categories'], //category
  queryFn: getCategories,
})

export const categoryRecipesQuery = (category) => ({
  queryKey: ['recipes', 'category', category], 
  queryFn: () => getRecipesByCategory(category),
})

export const searchRecipesQuery = (search) => ({
  queryKey: ['recipes', 'search', search],
  queryFn: () => getRecipesBySearch(search),
})

export const recipeQuery = (id) => ({
  queryKey: ['recipe', id],
  queryFn: () => getRecipeById(id),
  enabled: Boolean(id),
})
