import { Link, useParams } from 'react-router-dom'
import useToggle from '@hooks/useToggle'
import Recipe from '../../components/Recipe/Recipe'
import { useQuery } from '@tanstack/react-query'
import { recipeQuery } from '../../queries/mealQueries'
import './recipeDetails.css'
export default function RecipeDetails() {
  const { idRecipe } = useParams()
  const { toggle, handleToggle } = useToggle(false)
  const result = useQuery(recipeQuery(idRecipe))

  if (result.isPending) {
    return (
      <p role="status">Chargement de la recette...</p>
    )
  }
  if (result.isError) {
    return (
      <div role="alert">
        <p>Impossible de charger la recette : {result.error.message}</p>
        <button onClick={result.refetch}>Réessayer</button>
      </div>
    )
  }
  
  const recipe = result.data?.meals?.[0]
  if (!recipe) {
    return (
      <p>Recette introuvable.</p>
    )
  }
  return (
    <Recipe toggle={toggle} handleToggle={handleToggle} recipe={recipe}>
      <div id="recipe">
        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
        <aside>
          <Link to="/">{'<'} Retour</Link>
          <h2>{recipe.strMeal}</h2>
          <button id="openModale" onClick={handleToggle}>
            + Ajouter au planning
          </button>
          <p>{recipe.strInstructions}</p>
        </aside>
      </div>
    </Recipe>
  )
}
