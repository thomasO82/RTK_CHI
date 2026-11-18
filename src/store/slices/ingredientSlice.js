export const selectIngredients = (state) => state.ingredients
export const selectAddIngredients = (state) => state.addIngredients
export const selectEditIngredient = (state) => state.editIngredient
export const selectDeleteIngredient = (state) => state.deleteIngredient

export const createIngredientSlice = (set) => ({
  ingredients: [],

  addIngredients: (ingredients) =>
    set((state) => ({
      ingredients: [...state.ingredients, ...ingredients],
    })),

  deleteIngredient: (id) =>
    set((state) => ({
      ingredients: state.ingredients.filter((ingredient) => ingredient.id !== id),
    })),

  editIngredient: (updated) => {
    set((state) => ({
      ingredients: state.ingredients.map((ingredient) =>
        ingredient.id === updated.id ? { ...ingredient, ...updated } : ingredient,
      ),
    }))
  },
})
