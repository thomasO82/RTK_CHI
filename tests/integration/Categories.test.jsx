import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Categories from '../../src/pages/home/Categories/Categories'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
afterEach(() => queryClient.clear())

describe('Categories : tests d’intégration', () => {
  const setCategory = vi.fn()

  beforeEach(() => {
    setCategory.mockClear()
    render(
      <QueryClientProvider client={queryClient}>
        <Categories categoryProp="" setCategory={setCategory} />
      </QueryClientProvider>,
    )
  })

  test('affiche les catégories reçues de l’API simulée', async () => {
    expect(await screen.findByRole('button', { name: 'Beef' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chicken' })).toBeInTheDocument()
  })

  test('permet de choisir une catégorie après le chargement', async () => {
    fireEvent.click(await screen.findByRole('button', { name: 'Chicken' }))

    expect(setCategory).toHaveBeenCalledWith('Chicken')
  })
})
