import { expect, test } from 'bun:test';
import { MEAL_TAG_OPTIONS, mealTagOptions, toggleMealTag } from './mealTags';

test('ofrece exactamente las ocho categorías fijas', () => {
  expect(MEAL_TAG_OPTIONS).toEqual([
    'Ganancia de masa muscular',
    'Pérdida de peso',
    'Vegano',
    'Vegetariano',
    'Sin gluten',
    'Sin lactosa',
    'Keto-friendly',
    'Sin frutos secos',
  ]);
});

test('el desplegable solo ofrece las opciones fijas, aunque las comidas guarden otras etiquetas', () => {
  const existing = ['Salado', 'Dulce', 'Bedca', 'vegetariano', ' Sin gluten '];
  const options = mealTagOptions([existing, null]);
  expect(options).toEqual(MEAL_TAG_OPTIONS);
  expect(options).not.toContain('Salado');
  expect(options).not.toContain('Dulce');
  expect(options).not.toContain('Bedca');
  // las etiquetas guardadas no se tocan
  expect(existing).toEqual(['Salado', 'Dulce', 'Bedca', 'vegetariano', ' Sin gluten ']);
});

test('añadir una etiqueta no cambia las etiquetas anteriores', () => {
  const original = ['Ganancia de masa muscular', 'sin gluten'];
  expect(toggleMealTag(original, 'Sin lactosa', true)).toEqual([...original, 'Sin lactosa']);
  expect(original).toEqual(['Ganancia de masa muscular', 'sin gluten']);
});

test('añadir una etiqueta conserva las etiquetas que no están en el desplegable', () => {
  const original = ['Salado', 'Dulce'];
  expect(toggleMealTag(original, 'Keto-friendly', true)).toEqual(['Salado', 'Dulce', 'Keto-friendly']);
  expect(original).toEqual(['Salado', 'Dulce']);
});

test('quitar una etiqueta solo quita la opción elegida', () => {
  expect(toggleMealTag(['Vegano', 'Sin gluten'], 'Vegano', false)).toEqual(['Sin gluten']);
});
