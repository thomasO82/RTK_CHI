import { getCategories } from '../services/theMealDbApi.js'

export const categoriesQuery = () => ({
  queryKey: ['categories'],
  queryFn: getCategories,
})
