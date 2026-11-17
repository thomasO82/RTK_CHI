# RecipesI7 — TD5 : TanStack Query

Application React adaptée progressivement aux cinq TD. Cette branche `td5-tanstack-query` part du TD3 et ajoute la gestion des lectures TheMealDB avec TanStack Query.

| Branche | Contenu ajouté |
| --- | --- |
| td1-vues | Quatre routes, catégories, recherche, fiche et modale useToggle ; Axios et état local |
| td2-zustand | Hook Zustand pour recettes et ingrédients, courses de la semaine et calendrier |
| td3-planification | Action de planification atomique |
| td4-synchronisation | Suppression des ingrédients associés à une planification supprimée |
| td5-tanstack-query | Lectures TheMealDB avec TanStack Query |

Les branches disponibles dans ce dépôt sont `td2-zustand`, `td3-planification` et `td5-tanstack-query` ; les autres lignes indiquent les étapes du support. Pour comparer avec la version précédente : `git diff td3-planification..td5-tanstack-query`.

## Cette étape

`src/main.jsx` fournit un `QueryClientProvider` à toute l'application.
Le client unique est créé dans `src/queries/queryClient.js`, en dehors des composants.
Les clés et fonctions des requêtes sont regroupées dans `src/queries/mealQueries.js`.
Les composants Categories, Recipes, RecipeDetails et RecipeModal utilisent `useQuery` au lieu de gérer les appels Axios dans un `useEffect`.

| Lecture | Clé de cache |
| --- | --- |
| Catégories | `['categories']` |
| Recettes d'une catégorie | `['recipes', 'category', category]` |
| Recherche par nom | `['recipes', 'search', search]` |
| Fiche et ingrédients de la modale | `['recipe', id]` |

Chaque composant distingue le chargement (`isPending`), l'erreur (`isError`) et le résultat vide. Un bouton Réessayer relance une requête en erreur.
Les données sont considérées fraîches pendant une minute (`staleTime: 60_000`) : rouvrir une fiche ou sa modale réutilise alors le cache sans nouvel appel HTTP. Une requête en échec est retentée une fois (`retry: 1`).

## Inspecter TanStack Query

Lancer `npm run dev`, puis ouvrir le site et cliquer sur l'icône TanStack Query en bas à droite.
Les Devtools affichent les clés, l'état des requêtes et les données du cache. Elles sont disponibles en développement.
Choisir une catégorie, lancer une recherche, ouvrir une fiche puis sa modale pour voir les entrées correspondantes. Revenir à la catégorie précédente en moins d'une minute permet de constater la réutilisation du cache dans l'onglet Réseau du navigateur.

## Planning et courses

Les recettes planifiées, les ingrédients et leurs actions sont regroupés dans le hook src/store/useMealPlan.js.
Chaque planification possède son propre identifiant, distinct de l'identifiant TheMealDB.
Les ingrédients complets sont chargés avant la validation, y compris depuis une carte de catégorie.
Courses affiche la semaine locale courante, du lundi au dimanche, triée par consommation.
La quantité avec unité et la date sont modifiables, chaque ligne peut être supprimée.
FullCalendar affiche les recettes et permet de supprimer une planification.

La modale appelle maintenant `planRecipe(plan, ingredients)`, définie dans la slice des recettes.
Cette action ajoute la recette et ses ingrédients dans un seul appel à `set` : les abonnés reçoivent les deux tableaux ensemble, en une seule notification.
La suppression des ingrédients associés arrive au TD4. Le déplacement est un bonus non implémenté.
L'état est en mémoire : un rechargement remet les données à zéro.

## Commandes

`npm ci`, `npm run dev`, `npm run build`, `npm run lint`, `npm test`.

Les lectures nécessitent un accès à TheMealDB.

## Code simplifié

Les lectures HTTP utilisent toujours Axios ; TanStack Query gère leur chargement, leurs erreurs et leur cache. Les données TheMealDB sont retournées telles quelles.
Les fonctions `getIngredients` et `ingredientsForWeek` sont regroupées dans `src/utils/ingredients.js` pour extraire les ingrédients et filtrer ceux de la semaine.
La modale attribue les identifiants et la date ; le hook Zustand ajoute, modifie ou supprime les données préparées.
Les champs required du formulaire imposent une date.

## Organisation du store

Toute la gestion Zustand est dans src/store : useMealPlan.js combine slices/recipeSlice.js et slices/ingredientSlice.js.
Les sélecteurs sont exportés depuis useMealPlan.js. Les composants importent le hook commun ; chaque slice reçoit le même set.
