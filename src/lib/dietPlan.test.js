import { describe, it, expect } from 'bun:test';
import { calorieRange, assertDietVariety, scaleMeal, recipeGrams } from './dietPlan';
const day = (name, calories = 400) => ({ meals: [{ name, meal_type: 'breakfast', calories }] });
describe('Calorías reales y rotación semanal', () => {
  it('no sustituye las comidas por el objetivo 1649', () => expect(calorieRange([{ meals: [{ calories: 401, meal_type: 'breakfast' }, { calories: 586, meal_type: 'lunch' }, { calories: 169, meal_type: 'snack' }, { calories: 493, meal_type: 'dinner' }] }])).toEqual({ min: 1649, max: 1649 }));
  it('suma una alternativa por toma, no ambas', () => expect(calorieRange([{ meals: [{ calories: 401, meal_type: 'breakfast' }, { calories: 405, meal_type: 'breakfast' }, { calories: 562, meal_type: 'lunch' }, { calories: 586, meal_type: 'lunch' }] }])).toEqual({ min: 963, max: 991 }));
  it('varía con las cantidades reales', () => expect(scaleMeal({ calories: 400, protein_g: 20 }, 1.5).calories).toBe(600));
  it('obtiene los gramos de la receta, no del objetivo', () => expect(recipeGrams({ bedca_refs: [{ grams: 100 }, { grams: 50 }] })).toBe(150));
  it('bloquea dos planes con las mismas comidas aunque cambien orden o cantidades', () => expect(() => assertDietVariety([day('Pollo', 500), day('Arroz')], [[day('Arroz'), day('Pollo')]])).toThrow());
  it('exige variar las comidas al menos semanalmente', () => expect(() => assertDietVariety(Array.from({ length: 14 }, () => day('Pollo')), [])).toThrow());
  it('acepta nuevos platos', () => expect(() => assertDietVariety([day('Merluza')], [[day('Pollo')]])).not.toThrow());
  it('no inventa calorías cuando faltan datos', () => expect(calorieRange([{ meals: [{ calories: null }] }])).toBeNull());
});
