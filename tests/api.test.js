import test from 'node:test'
import assert from 'node:assert/strict'
import axios from 'axios'
import { getRecipesBySearch, getRecipeById } from '../src/services/theMealDbApi.js'

test('Axios reçoit les paramètres de recherche et retourne les données', async () => {
  const original = axios.get
  axios.get = async (url, options) => {
    assert.equal(url, 'https://www.themealdb.com/api/json/v1/1/search.php')
    assert.deepEqual(options, { params: { s: 'fish & chips' } })
    return { data: { meals: null } }
  }
  try { assert.deepEqual(await getRecipesBySearch('fish & chips'), { meals: null }) }
  finally { axios.get = original }
})

test('une erreur Axios reste une erreur', async () => {
  const original = axios.get
  axios.get = async () => { throw new Error('Request failed with status code 503') }
  try { await assert.rejects(getRecipeById('42'), /503/) }
  finally { axios.get = original }
})

test('la fiche retourne les données Axios sans les modifier', async () => {
  const original = axios.get
  const data = { meals: [{ idMeal: '42', strIngredient1: 'Carotte' }] }
  axios.get = async () => { return { data } }
  try {
    assert.equal(await getRecipeById('42'), data)
    assert.deepEqual(data, { meals: [{ idMeal: '42', strIngredient1: 'Carotte' }] })
  } finally { axios.get = original }
})

test('une fiche introuvable reste un résultat vide', async () => {
  const original = axios.get
  axios.get = async () => ({ data: { meals: null } })
  try { assert.deepEqual(await getRecipeById('missing'), { meals: null }) }
  finally { axios.get = original }
})
