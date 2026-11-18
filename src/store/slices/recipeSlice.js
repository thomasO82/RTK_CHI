export const selectPlanRecipe = (state) => state.planRecipe
export const selectRecipes = (state) => state.recipes
export const selectAddRecipe = (state) => state.addRecipe
export const selectDeleteRecipe = (state) => state.deleteRecipe

export const createRecipeSlice = (set) => ({
  recipes: [],

  planRecipe: (recipe, ingredients) =>
    set((state) => ({
      recipes: [...state.recipes, recipe],
      ingredients: [...state.ingredients, ...ingredients],
    })),

  addRecipe: (recipe) =>
    set((state) => ({
      recipes: [...state.recipes, recipe],
    })),

  deleteRecipe: (id) =>
    set((state) => ({
      recipes: state.recipes.filter((recipe) => recipe.id !== id),
    })),
})
