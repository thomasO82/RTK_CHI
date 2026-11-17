import { useQuery } from '@tanstack/react-query'
import { categoriesQuery } from '../../../queries/mealQueries'
export default function Categories({ categoryProp, setCategory }) {
  const { data, isPending, isError, error, refetch } = useQuery(categoriesQuery())
  const categories = data?.categories ?? []
  if (isPending) {
    return (
      <p role="status">Chargement des catégories...</p>
    )
  }
  if (isError) {
    return (
      <div role="alert">
        <p>Impossible de charger les catégories : {error.message}</p>
        <button onClick={refetch}>Réessayer</button>
      </div>
    )
  }
  if (!categories.length) {
    return (
      <p>Aucune catégorie trouvée.</p>
    )
  }
  return (
    <ul id="categories">
      {categories.map((category) => {
        return (
          <li
            key={category.idCategory}
            className={categoryProp === category.strCategory ? 'active' : ''}
          >
            <button
              onClick={() => {
                return setCategory(category.strCategory)
              }}
            >
              {category.strCategory}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
