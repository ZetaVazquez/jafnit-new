import { expect, test } from 'bun:test';
import { MEAL_TAG_OPTIONS, mealTagOptions, toggleMealTag } from './mealTags';

test('ofrece las seis categorías solicitadas', () => {
  expect(MEAL_TAG_OPTIONS).toEqual(['Ganancia de masa muscular', 'Pérdida de peso', 'Vegano', 'Vegetariano', 'Sin gluten', 'Sin lactosa']);
});

test('conserva etiquetas existentes exactamente sin normalizarlas', () => {
  const existing = ['vegetariano', ' Ganancia de masa muscular ', 'alto en proteína'];
  const options = mealTagOptions([existing, null]);
  for (const tag of existing) expect(options).toContain(tag);
  expect(existing).toEqual(['vegetariano', ' Ganancia de masa muscular ', 'alto en proteína']);
});

test('añadir una etiqueta no cambia las etiquetas anteriores', () => {
  const original = ['Ganancia de masa muscular', 'sin gluten'];
  expect(toggleMealTag(original, 'Sin lactosa', true)).toEqual([...original, 'Sin lactosa']);
  expect(original).toEqual(['Ganancia de masa muscular', 'sin gluten']);
});

test('quitar una etiqueta solo quita la opción elegida', () => {
  expect(toggleMealTag(['Vegano', 'Sin gluten'], 'Vegano', false)).toEqual(['Sin gluten']);
});