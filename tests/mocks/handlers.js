import { http, HttpResponse } from 'msw'

export const categories = [
  {
    idCategory: '1',
    strCategory: 'Beef',
    strCategoryThumb: 'https://www.themealdb.com/images/category/beef.png',
    strCategoryDescription: 'Recettes à base de bœuf.',
  },
  {
    idCategory: '2',
    strCategory: 'Chicken',
    strCategoryThumb: 'https://www.themealdb.com/images/category/chicken.png',
    strCategoryDescription: 'Recettes à base de poulet.',
  },
]

export const categoriesUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php'

export const handlers = [
  http.get(categoriesUrl, () => HttpResponse.json({ categories })),
]
