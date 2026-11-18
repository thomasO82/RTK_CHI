import { useQuery } from '@tanstack/react-query'
import { useMealPlan } from '../../../store/useMealPlan'
import { selectPlanRecipe } from '../../../store/slices/recipeSlice'
import { getIngredients } from '../../../utils/ingredients'
import { recipeQuery } from '../../../queries/mealQueries'
export default function RecipeModal({ recipe, onClose }) {
  const result = useQuery(recipeQuery(recipe.idMeal))

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
      {result.isPending && <p role="status">Chargement des ingrédients...</p>}
      {result.isError && (
        <div role="alert">
          <p>Impossible de charger les ingrédients : {result.error.message}</p>
          <button onClick={result.refetch}>Réessayer</button>
        </div>
      )}
      {!result.isPending && !result.isError && !meal && (
        <p>Recette introuvable.</p>
      )}
      <form onSubmit={submit}>
        <label>
          Date de consommation{' '}
          <input name="date" type="datetime-local" required />
        </label>
        <button disabled={!meal || result.isError}>Ajouter</button>
      </form>
    </>
  )
}
