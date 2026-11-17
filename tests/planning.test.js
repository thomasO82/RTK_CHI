import test from 'node:test'
import assert from 'node:assert/strict'
import { useMealPlan } from '../src/store/useMealPlan.js'
import { ingredientsForWeek, getIngredients } from '../src/utils/ingredients.js'
import { toDateInput } from '../src/utils/dates.js'

test('planifier ajoute la recette et ses ingrédients en une seule notification', () => {
  const firstPlan = { id: 'plan-1', mealId: '42', title: 'Soupe', date: 100 }
  const firstIngredient = { id: 'ingredient-1', name: 'Carotte', planId: 'plan-1', date: 100 }
  const recipes = [firstPlan]
  const ingredients = [firstIngredient]
  useMealPlan.setState({ recipes, ingredients })

  const secondPlan = { id: 'plan-2', mealId: '42', title: 'Soupe', date: 200 }
  const secondIngredients = [
    { id: 'ingredient-2', name: 'Carotte', quantity: '2 kg', planId: 'plan-2', date: 200 },
    { id: 'ingredient-3', name: 'Sel', quantity: '1 pincée', planId: 'plan-2', date: 200 },
  ]
  const notifications = []
  const unsubscribe = useMealPlan.subscribe((state) => {
    notifications.push({ recipes: state.recipes, ingredients: state.ingredients })
  })

  try {
    useMealPlan.getState().planRecipe(secondPlan, secondIngredients)

    assert.equal(notifications.length, 1)
    assert.deepEqual(notifications[0], {
      recipes: [firstPlan, secondPlan],
      ingredients: [firstIngredient, ...secondIngredients],
    })
    assert.deepEqual(recipes, [firstPlan])
    assert.deepEqual(ingredients, [firstIngredient])
  } finally {
    unsubscribe()
    useMealPlan.setState({ recipes: [], ingredients: [] })
  }
})

test('modifier puis supprimer une ligne conserve les autres ingrédients', () => {
  const first = { id: '1', name: 'Carotte', quantity: '2 kg', date: 100, planId: 'a' }
  const second = { id: '2', name: 'Sel', quantity: '1 pincée', date: 200, planId: 'b' }
  useMealPlan.setState({ recipes: [], ingredients: [first, second] })
  const state = useMealPlan.getState()
  state.editIngredient({ id: '1', quantity: '500 g', date: 300 })
  assert.deepEqual(useMealPlan.getState().ingredients, [
    { ...first, quantity: '500 g', date: 300 }, second,
  ])
  assert.equal(first.quantity, '2 kg')
  assert.equal(first.date, 100)
  state.editIngredient({ id: '1', quantity: '250 g' })
  assert.equal(useMealPlan.getState().ingredients[0].date, 300)
  assert.equal(useMealPlan.getState().ingredients[0].quantity, '250 g')
  const before = useMealPlan.getState().ingredients
  state.editIngredient({ id: 'missing', quantity: '1 kg' })
  assert.deepEqual(useMealPlan.getState().ingredients, before)
  state.deleteIngredient('1')
  assert.deepEqual(useMealPlan.getState().ingredients, [second])
})

test('la semaine locale va du lundi inclus au lundi suivant exclu, tri sans mutation', () => {
  const monday = new Date(2026, 10, 16, 12).getTime()
  const sunday = new Date(2026, 10, 22, 23, 59).getTime()
  const items = [
    { id: 'sun', date: sunday }, { id: 'mon', date: new Date(2026, 10, 16).getTime() },
    { id: 'before', date: new Date(2026, 10, 15, 23, 59).getTime() },
    { id: 'after', date: new Date(2026, 10, 23).getTime() },
  ]
  assert.deepEqual(ingredientsForWeek(items, new Date(monday)).map((i) => i.id), ['mon', 'sun'])
  assert.deepEqual(ingredientsForWeek(items, new Date(sunday)).map((i) => i.id), ['mon', 'sun'])
  assert.equal(items[0].id, 'sun')
  assert.equal(toDateInput(new Date(2026, 10, 16, 0, 10).getTime()), '2026-11-16')
})

test('extraire les ingrédients ignore les champs vides et conserve les unités', () => {
  const meal = {
    strIngredient1: ' Carotte ', strMeasure1: '2 kg',
    strIngredient2: ' ', strIngredient3: null,
    strIngredient20: 'Sel', strMeasure20: null,
  }
  assert.deepEqual(getIngredients(meal), [
    { name: 'Carotte', quantity: '2 kg' },
    { name: 'Sel', quantity: '' },
  ])
  assert.equal(meal.ingredients, undefined)
})
