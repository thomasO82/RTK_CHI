import { useEffect, useState } from 'react'
import { getRecipesBySearch, getRecipesByCategory } from '../../../services/theMealDbApi'
import RecipeCard from './RecipeCard'
import './recipes.css'

export default function Recipes({ category, search }) {
  const [result, setResult] = useState({ isLoading: true })

  useEffect(() => {
    let active = true
    setResult({ isLoading: true })
    const request = search
      ? getRecipesBySearch(search)
      : getRecipesByCategory(category)

    request
      .then((data) => {
        if (active) {
          setResult({ data })
        }
      })
      .catch((error) => {
        if (active) {
          setResult({ error, isError: true })
        }
      })

    return () => {
      active = false
    }
  }, [category, search])

  const recipes = result.data?.meals ?? []
  if (result.isLoading) {
    return <p role="status">Chargement des recettes...</p>
  }
  if (result.isError) {
    return (
      <p role="alert">Impossible de charger les recettes : {result.error.message}</p>
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
