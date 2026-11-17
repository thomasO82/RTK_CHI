import { useEffect, useState } from 'react'
import { useMealPlan, selectPlanRecipe } from '../../../store/useMealPlan'
import { getIngredients } from '../../../utils/ingredients'
import { getRecipeById } from '../../../services/theMealDbApi'
export default function RecipeModal({ recipe, onClose }) {
  const [result, setResult] = useState({
    isLoading: true,
  })
  useEffect(() => {
    setResult({ isLoading: true })

    getRecipeById(recipe.idMeal)
      .then((data) => {
        setResult({ data })
      })
      .catch((error) => {
        setResult({ error, isError: true })
      })
  }, [recipe.idMeal])

  const meal = result.data?.meals?.[0]
  const planRecipe = useMealPlan(selectPlanRecipe)
  const submit = (event) => {
    event.preventDefault()
    const date = new Date(
      new FormData(event.currentTarget).get('date'),
    ).getTime()
    const id = crypto.randomUUID()
    const plan = {
      id,
      mealId: meal.idMeal,
      title: meal.strMeal,
      date,
    }
    const ingredients = getIngredients(meal).map((item) => {
      return {
        ...item,
        id: crypto.randomUUID(),
        planId: id,
        date,
        recipe: meal.strMeal,
      }
    })
    planRecipe(plan, ingredients)
    onClose()
  }
  return (
    <>
      <h2>Ajouter une recette au planning</h2>
      <p>{recipe.strMeal}</p>
      {result.isLoading && <p role="status">Chargement des ingrédients...</p>}
      {result.isError && <p role="alert">{result.error.message}</p>}
      {!result.isLoading && !result.isError && !meal && (
        <p>Recette introuvable.</p>
      )}
      <form onSubmit={submit}>
        <label>
          Date de consommation{' '}
          <input name="date" type="datetime-local" required />
        </label>
        <button disabled={!meal}>Ajouter</button>
      </form>
    </>
  )
}
