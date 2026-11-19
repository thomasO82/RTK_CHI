import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Categories from '../../src/pages/home/Categories/Categories'

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: { categories: [{ idCategory: '1', strCategory: 'Beef' }] },
    isPending: false,
    isError: false,
  }),
}))

describe('Categories : tests unitaires', () => {
  test('affiche une catégorie', () => {
    render(<Categories categoryProp="" setCategory={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Beef' })).toBeInTheDocument()
  })

  test('transmet la catégorie au clic', () => {
    const setCategory = vi.fn()
    render(<Categories categoryProp="" setCategory={setCategory} />)

    fireEvent.click(screen.getByRole('button', { name: 'Beef' }))

    expect(setCategory).toHaveBeenCalledWith('Beef')
  })
})
