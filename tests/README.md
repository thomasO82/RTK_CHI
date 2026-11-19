# Quatre tests courts sur Categories

- `unit/Categories.test.jsx` : simule `useQuery` et vérifie qu’un clic transmet la catégorie au parent.
- `integration/Categories.test.jsx` : utilise TanStack Query et Axios réels, avec une réponse HTTP simulée par MSW.

`setup.js` prépare les assertions DOM et le serveur MSW. Les réponses simulées sont dans `mocks/handlers.js`.

```bash
npm run test:run          # Les quatre tests
npm run test:unit         # Les deux tests unitaires
npm run test:integration  # Les deux tests d’intégration
```

MSW v2 reprend l’API du cours. Vitest nécessite Node.js 22.12 ou supérieur. Aucun Cypress.

