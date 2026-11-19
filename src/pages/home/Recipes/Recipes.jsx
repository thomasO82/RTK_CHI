import { useQuery } from '@tanstack/react-query'
import { searchRecipesQuery, categoryRecipesQuery } from '../../../queries/mealQueries'
import RecipeCard from './RecipeCard'
import './recipes.css'

export default function Recipes({ category, search }) {
  const query = search ? searchRecipesQuery(search) : categoryRecipesQuery(category)
  const { data, isPending, isError, error, refetch } = useQuery(query)
  const recipes = data?.meals ?? []

  if (isPending) {
    return <p role="status">Chargement des recettes...</p>
  }
  if (isError) {
    return (
      <div role="alert">
        <p>Impossible de charger les recettes : {error.message}</p>
        <button onClick={refetch}>Réessayer</button>
      </div>
    )
  }

  return (
    <div id="recipes">
      {recipes.length === 0 && <p>Aucune recette disponible.</p>}
      {recipes.map((recipe) => {
        return (
          <RecipeCard recipe={recipe} key={recipe.idMeal} />
        )
      })}
    </div>
  )
}
