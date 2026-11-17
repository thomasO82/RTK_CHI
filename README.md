# RecipesI7 — TD3 : action de planification

Application React adaptée progressivement aux cinq TD. La base actuelle du TD2 est conservée sur `td2-zustand` et le TD3 est réalisé sur `td3-planification`.

| Branche | Contenu ajouté |
| --- | --- |
| td1-vues | Quatre routes, catégories, recherche, fiche et modale useToggle ; Axios et état local |
| td2-zustand | Hook Zustand pour recettes et ingrédients, courses de la semaine et calendrier |
| td3-planification | Action de planification atomique |
| td4-synchronisation | Suppression des ingrédients associés à une planification supprimée |
| td5-tanstack-query | Lectures TheMealDB avec TanStack Query |

Les branches disponibles dans ce dépôt sont `td2-zustand` et `td3-planification` ; les autres lignes indiquent les étapes du support. Pour revenir au TD2 : `git switch td2-zustand`.

## Cette étape

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

Les lectures HTTP utilisent Axios. Les données TheMealDB sont retournées telles quelles.
Les fonctions `getIngredients` et `ingredientsForWeek` sont regroupées dans `src/utils/ingredients.js` pour extraire les ingrédients et filtrer ceux de la semaine.
La modale attribue les identifiants et la date ; le hook Zustand ajoute, modifie ou supprime les données préparées.
Les champs required du formulaire imposent une date.

## Organisation du store

Toute la gestion Zustand est dans src/store : useMealPlan.js combine slices/recipeSlice.js et slices/ingredientSlice.js.
Les sélecteurs sont exportés depuis useMealPlan.js. Les composants importent le hook commun ; chaque slice reçoit le même set.
