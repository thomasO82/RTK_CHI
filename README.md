# RecipesI7 — TD2 : ingrédients et planning

Application React adaptée progressivement aux cinq TD. Le code original est conservé sur main.

| Branche | Contenu ajouté |
| --- | --- |
| td1-vues | Quatre routes, catégories, recherche, fiche et modale useToggle ; Axios et état local |
| td2-zustand | Hook Zustand pour recettes et ingrédients, courses de la semaine et calendrier |
| td3-planification | Action de planification atomique |
| td4-synchronisation | Suppression des ingrédients associés à une planification supprimée |
| td5-tanstack-query | Lectures TheMealDB avec TanStack Query |

Chaque branche reprend la précédente. Pour changer : `git switch td1-vues`, puis `npm ci`.

## Cette étape

Les recettes planifiées, les ingrédients et leurs actions sont regroupés dans le hook src/store/useMealPlan.js.
Chaque planification possède son propre identifiant, distinct de l'identifiant TheMealDB.
Les ingrédients complets sont chargés avant la validation, y compris depuis une carte de catégorie.
Courses affiche la semaine locale courante, du lundi au dimanche, triée par consommation.
La quantité avec unité et la date sont modifiables, chaque ligne peut être supprimée.
FullCalendar affiche les recettes et permet de supprimer une planification.

À ce stade, la modale effectue deux mises à jour successives. L'action atomique arrive au TD3.
La suppression des ingrédients associés arrive au TD4. Le déplacement est un bonus non implémenté.
L'état est en mémoire : un rechargement remet les données à zéro.

## Commandes

`npm ci`, `npm run dev`, `npm run build`, `npm run lint`, `npm test`.

Les lectures nécessitent un accès à TheMealDB.

## Code simplifié

Les lectures HTTP utilisent Axios. Les données TheMealDB sont retournées telles quelles.
Les ingrédients sont extraits dans src/store/useMealPlan.js.
La modale attribue les identifiants et la date ; le hook Zustand ajoute, modifie ou supprime les données préparées.
Les champs required du formulaire imposent une date.

## Organisation du store

Toute la gestion Zustand est dans src/store : useMealPlan.js combine slices/recipeSlice.js et slices/ingredientSlice.js.
Les sélecteurs sont exportés depuis useMealPlan.js. Les composants importent le hook commun ; chaque slice reçoit le même set.
