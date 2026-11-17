import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import { useState } from 'react'
import { useMealPlan } from '../../store/useMealPlan'
import useToggle from '../../hooks/useToggle'
import Modal from '@components/Modal/Modal'
import './planning.css'
export default function Planning() {
  const recipes = useMealPlan((state) => {
    return state.recipes
  })
  const deleteRecipe = useMealPlan((state) => {
    return state.deleteRecipe
  })
  const { toggle, handleToggle } = useToggle(false)
  const [idRecipe, setIdRecipe] = useState(null)
  const showEvent = ({ event }) => {
    setIdRecipe(event.id)
    handleToggle()
  }
  const deleteEvent = () => {
    deleteRecipe(idRecipe)
    handleToggle()
  }
  const events = recipes.map(({ id, title, date }) => {
    return {
      id,
      title,
      start: new Date(date),
    }
  })
  return (
    <section className="fullCalendarContainer">
      <h2>Planning</h2>
      {!events.length && <p>Aucune recette planifiée.</p>}
      <FullCalendar
        plugins={[dayGridPlugin]}
        events={events}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'prev,next today',
        }}
        eventClick={showEvent}
        height="auto"
      />
      {toggle && (
        <Modal handleToggle={handleToggle}>
          <p>Supprimer cette recette planifiée ?</p>
          <button onClick={deleteEvent}>Oui</button>
          <button onClick={handleToggle}>Non</button>
        </Modal>
      )}
    </section>
  )
}
