import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import themePlugin from '@fullcalendar/react/themes/classic'
import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/classic/theme.css'
import '@fullcalendar/react/themes/classic/palette.css'

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
        plugins={[themePlugin, dayGridPlugin]}
        events={events}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'title',
          end: 'prev,next today',
        }}
        headerToolbarClass="planningToolbar"
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
