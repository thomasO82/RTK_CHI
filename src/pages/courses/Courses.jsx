import { useMealPlan } from '../../store/useMealPlan'
import { selectIngredients } from '../../store/slices/ingredientSlice'
import { ingredientsForWeek } from '../../utils/ingredients'
import IngredientCard from './IngredientCard'
import './courses.css'
export default function Courses() {
  const allIngredients = useMealPlan(selectIngredients)
  const ingredients = ingredientsForWeek(allIngredients)
  return (
    <section>
      <h2>Liste de courses — semaine courante</h2>
      <p>Du lundi au dimanche, par date de consommation.</p>
      {!ingredients.length && <p>Aucun ingrédient pour cette semaine.</p>}
      <div className="ingredients">
        {ingredients.map((ingredient) => {
          return (
            <IngredientCard key={ingredient.id} ingredient={ingredient} />
          )
        })}
      </div>
    </section>
  )
}
