# RecipesI7 — TD5 : exemple TanStack Query sur les catégories

Le calendrier utilise FullCalendar React v7 et `temporal-polyfill`. Les plugins, le thème classic et les styles sont importés ensemble dans `Planning.jsx`. Installation : `npm install @fullcalendar/react@^7 temporal-polyfill`.

Application React adaptée progressivement aux cinq TD. Cette branche `td5-tanstack-query` part du TD3 et présente un seul exemple TanStack Query : le chargement de la liste des catégories. Les autres lectures restent des appels Axios dans les composants.

| Branche | Contenu ajouté |
| --- | --- |
| td1-vues | Quatre routes, catégories, recherche, fiche et modale useToggle ; Axios et état local |
| td2-zustand | Hook Zustand pour recettes et ingrédients, courses de la semaine et calendrier |
| td3-planification | Action de planification atomique |
| td4-synchronisation | Suppression des ingrédients associés à une planification supprimée |
| td5-tanstack-query | Exemple TanStack Query limité à la liste des catégories |

Les branches disponibles dans ce dépôt sont `td2-zustand`, `td3-planification` et `td5-tanstack-query` ; les autres lignes indiquent les étapes du support. Pour comparer avec la version précédente : `git diff td3-planification..td5-tanstack-query`.

## Cette étape

`src/main.jsx` fournit un `QueryClientProvider` à toute l'application.
Le client unique est créé dans `src/queries/queryClient.js`, en dehors des composants.
`src/queries/mealQueries.js` contient uniquement `categoriesQuery`, avec la clé `['categories']` et la fonction Axios `getCategories`.
Seul le composant `Categories` appelle `useQuery`. Il distingue le chargement (`isPending`), l'erreur (`isError`) et le résultat vide. Son bouton Réessayer relance la requête.
Les composants `Recipes`, `RecipeDetails` et `RecipeModal` chargent leurs données directement avec les fonctions Axios du service, dans un `useEffect`. Ils conservent leurs messages de chargement, d'erreur et de résultat vide.

Le cheminement à étudier est : `queryClient.js` → `main.jsx` et son provider → `Categories.jsx` et `useQuery(categoriesQuery())` → `mealQueries.js` et `queryFn` → `theMealDbApi.js` et Axios → retour des données dans `Categories.jsx`.
La durée de fraîcheur utilise le comportement par défaut de TanStack Query : les données sont immédiatement considérées anciennes. Le cache permet de les afficher sans attendre, tandis qu'une nouvelle récupération peut se déclencher au montage, au retour sur la fenêtre ou à la reconnexion. Les appels simultanés pour une même clé restent partagés. Une requête en échec est retentée une fois (`retry: 1`).

## Inspecter TanStack Query

Lancer `npm run dev`, puis ouvrir le site et cliquer sur l'icône TanStack Query en bas à droite.
Les Devtools affichent les clés, l'état des requêtes et les données du cache. Elles sont disponibles en développement.
Les Devtools montrent uniquement `['categories']`, même après une recherche ou l'ouverture d'une fiche. Les appels de recettes restent visibles dans l'onglet Réseau du navigateur, mais ne créent aucune entrée dans le cache TanStack Query.

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

Toutes les lectures HTTP utilisent Axios. TanStack Query gère seulement le chargement, les erreurs et le cache de la liste des catégories. Les autres lectures sont gérées par les composants avec leur état local. Les données TheMealDB sont retournées telles quelles.
Les fonctions `getIngredients` et `ingredientsForWeek` sont regroupées dans `src/utils/ingredients.js` pour extraire les ingrédients et filtrer ceux de la semaine.
La modale attribue les identifiants et la date ; le hook Zustand ajoute, modifie ou supprime les données préparées.
Les champs required du formulaire imposent une date.

## Organisation du store

Toute la gestion Zustand est dans src/store : useMealPlan.js combine slices/recipeSlice.js et slices/ingredientSlice.js.
Les sélecteurs sont définis et exportés dans leur slice. Les composants importent directement les sélecteurs depuis `recipeSlice.js` ou `ingredientSlice.js`, et le hook commun depuis `useMealPlan.js`. Chaque slice reçoit le même `set`.
