import { useState } from 'react'
import { useMealPlan } from '../../store/useMealPlan'
import { selectEditIngredient, selectDeleteIngredient } from '../../store/slices/ingredientSlice'
import { toDateInput } from '../../utils/dates'
export default function IngredientCard({ ingredient }) {
  const [editing, setEditing] = useState(false)
  const editIngredient = useMealPlan(selectEditIngredient)
  const deleteIngredient = useMealPlan(selectDeleteIngredient)
  const save = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const date = new Date(form.get('date') + 'T00:00:00').getTime()
    editIngredient({
      id: ingredient.id,
      quantity: form.get('quantity'),
      date,
    })
    setEditing(false)
  }
  return (
    <article className="ingredient">
      <h2>{ingredient.name}</h2>
      <p>
        <strong>Recette :</strong> {ingredient.recipe}
      </p>
      {editing ? (
        <form onSubmit={save}>
          <label>
            Quantité et unité{' '}
            <input name="quantity" defaultValue={ingredient.quantity} />
          </label>
          <label>
            Date de consommation{' '}
            <input
              name="date"
              type="date"
              required
              defaultValue={toDateInput(ingredient.date)}
            />
          </label>
          <button>Enregistrer</button>
          <button
            type="button"
            onClick={() => {
              return setEditing(false)
            }}
          >
            Annuler
          </button>
        </form>
      ) : (
        <>
          <p>
            <strong>Quantité :</strong> {ingredient.quantity}
          </p>
          <p>
            <strong>Date de consommation :</strong>{' '}
            {new Date(ingredient.date).toLocaleDateString('fr-FR')}
          </p>
          <button
            onClick={() => {
              return setEditing(true)
            }}
          >
            Modifier
          </button>
        </>
      )}
      <button
        onClick={() => {
          return deleteIngredient(ingredient.id)
        }}
      >
        Supprimer
      </button>
    </article>
  )
}
