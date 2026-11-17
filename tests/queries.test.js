import test, { afterEach } from 'node:test'
import assert from 'node:assert/strict'
import axios from 'axios'
import { queryClient } from '../src/queries/queryClient.js'
import {
  categoriesQuery,
  categoryRecipesQuery,
  searchRecipesQuery,
  recipeQuery,
} from '../src/queries/mealQueries.js'

const originalGet = axios.get

afterEach(() => {
  axios.get = originalGet
  queryClient.clear()
})

test('catégories, catégories de recettes, recherches et fiches ont des caches distincts', async () => {
  axios.get = async (url, { params } = {}) => {
    if (url.endsWith('categories.php')) {
      return { data: { categories: [{ idCategory: '1', strCategory: 'Beef' }] } }
    }
    if (url.endsWith('filter.php')) {
      return { data: { meals: [{ idMeal: 'category', strMeal: params.c }] } }
    }
    if (url.endsWith('search.php')) {
      return { data: { meals: [{ idMeal: 'search', strMeal: params.s }] } }
    }
    return { data: { meals: [{ idMeal: params.i }] } }
  }

  const queries = [
    categoriesQuery(), categoryRecipesQuery('Beef'), categoryRecipesQuery('Chicken'),
    searchRecipesQuery('Beef'), searchRecipesQuery('Chicken'),
    recipeQuery('42'), recipeQuery('43'),
  ]
  const results = await Promise.all(queries.map((query) => queryClient.fetchQuery(query)))

  assert.deepEqual(results, [
    { categories: [{ idCategory: '1', strCategory: 'Beef' }] },
    { meals: [{ idMeal: 'category', strMeal: 'Beef' }] },
    { meals: [{ idMeal: 'category', strMeal: 'Chicken' }] },
    { meals: [{ idMeal: 'search', strMeal: 'Beef' }] },
    { meals: [{ idMeal: 'search', strMeal: 'Chicken' }] },
    { meals: [{ idMeal: '42' }] },
    { meals: [{ idMeal: '43' }] },
  ])
})

test('les appels simultanés sont partagés puis les données en cache sont actualisées', async () => {
  let calls = 0
  axios.get = async () => {
    calls++
    return { data: { meals: [{ idMeal: '42', strMeal: 'Soupe' }] } }
  }

  const [details, modal] = await Promise.all([
    queryClient.fetchQuery(recipeQuery('42')),
    queryClient.fetchQuery(recipeQuery('42')),
  ])
  assert.deepEqual(details, { meals: [{ idMeal: '42', strMeal: 'Soupe' }] })
  assert.deepEqual(modal, details)
  assert.equal(calls, 1)
  assert.deepEqual(queryClient.getQueryData(recipeQuery('42').queryKey), details)

  axios.get = async () => {
    calls++
    return { data: { meals: [{ idMeal: '42', strMeal: 'Soupe corrigée' }] } }
  }
  assert.deepEqual(await queryClient.fetchQuery(recipeQuery('42')), {
    meals: [{ idMeal: '42', strMeal: 'Soupe corrigée' }],
  })
  assert.equal(calls, 2)
})

test('une erreur réseau reste une erreur de requête et une nouvelle tentative peut réussir', async () => {
  axios.get = async () => { throw new Error('Service indisponible') }
  const query = { ...searchRecipesQuery('Soup'), retry: false }

  await assert.rejects(queryClient.fetchQuery(query), /Service indisponible/)
  assert.equal(queryClient.getQueryState(query.queryKey).status, 'error')
  assert.equal(queryClient.getQueryData(query.queryKey), undefined)

  axios.get = async () => ({ data: { meals: [{ idMeal: '42' }] } })
  assert.deepEqual(await queryClient.fetchQuery(query), { meals: [{ idMeal: '42' }] })
})

test('un résultat vide reste un succès pour une recherche et une fiche introuvable', async () => {
  axios.get = async () => ({ data: { meals: null } })

  for (const query of [searchRecipesQuery('introuvable'), recipeQuery('missing')]) {
    assert.deepEqual(await queryClient.fetchQuery(query), { meals: null })
    assert.equal(queryClient.getQueryState(query.queryKey).status, 'success')
  }
})
