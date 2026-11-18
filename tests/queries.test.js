import test, { afterEach } from 'node:test'
import assert from 'node:assert/strict'
import axios from 'axios'
import { queryClient } from '../src/queries/queryClient.js'
import { categoriesQuery } from '../src/queries/mealQueries.js'

const originalGet = axios.get

afterEach(() => {
  axios.get = originalGet
  queryClient.clear()
})

test('les catégories partagent leur requête et le cache peut être actualisé', async () => {
  let calls = 0
  axios.get = async (url) => {
    assert.equal(url, 'https://www.themealdb.com/api/json/v1/1/categories.php')
    calls++
    return { data: { categories: [{ idCategory: '1', strCategory: 'Beef' }] } }
  }

  const [first, second] = await Promise.all([
    queryClient.fetchQuery(categoriesQuery()),
    queryClient.fetchQuery(categoriesQuery()),
  ])
  assert.deepEqual(first, { categories: [{ idCategory: '1', strCategory: 'Beef' }] })
  assert.deepEqual(second, first)
  assert.equal(calls, 1)
  assert.deepEqual(queryClient.getQueryData(['categories']), first)

  axios.get = async () => ({ data: { categories: [{ idCategory: '2', strCategory: 'Chicken' }] } })
  assert.deepEqual(await queryClient.fetchQuery(categoriesQuery()), {
    categories: [{ idCategory: '2', strCategory: 'Chicken' }],
  })
})

test('retry 1 retente les catégories une fois avant de signaler une erreur', async () => {
  let calls = 0
  axios.get = async () => {
    calls++
    throw new Error('Service indisponible')
  }

  const query = { ...categoriesQuery(), retryDelay: 0 }
  await assert.rejects(queryClient.fetchQuery(query), /Service indisponible/)
  assert.equal(calls, 2)
  assert.equal(queryClient.getQueryState(['categories']).status, 'error')

  axios.get = async () => ({ data: { categories: [] } })
  assert.deepEqual(await queryClient.fetchQuery(query), { categories: [] })
  assert.equal(queryClient.getQueryState(['categories']).status, 'success')
})

test('une liste de catégories vide reste un succès', async () => {
  axios.get = async () => ({ data: { categories: [] } })
  assert.deepEqual(await queryClient.fetchQuery(categoriesQuery()), { categories: [] })
  assert.equal(queryClient.getQueryState(['categories']).status, 'success')
})
