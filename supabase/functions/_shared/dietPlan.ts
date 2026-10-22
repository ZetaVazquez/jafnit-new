export interface DietMeal {
  name?: string; meal_id?: string; meal_type?: string; calories?: number | null;
  protein_g?: number | null; carbs_g?: number | null; fats_g?: number | null;
  quantity?: string; ingredients_detail?: any[] | null;
  [key: string]: any;
}
export interface DietDay { day?: string; meals: DietMeal[] }
const normalize = (v: string) => v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
const typeOf = (m: DietMeal) => ({ desayuno: 'breakfast', comida: 'lunch', merienda: 'snack', cena: 'dinner' }[m.meal_type || ''] || m.meal_type || 'otro');
export function calorieRange(days: DietDay[]) {
  if (!days.length) return null;
  let min = Infinity, max = -Infinity;
  for (const day of days) {
    if (!day.meals?.length || day.meals.some(m => m.calories == null || !Number.isFinite(Number(m.calories)) || Number(m.calories) <= 0)) return null;
    const groups = new Map<string, number[]>();
    day.meals.forEach(m => groups.set(typeOf(m), [...(groups.get(typeOf(m)) || []), Number(m.calories)]));
    min = Math.min(min, [...groups.values()].reduce((s, a) => s + Math.min(...a), 0));
    max = Math.max(max, [...groups.values()].reduce((s, a) => s + Math.max(...a), 0));
  }
  return { min: Math.round(min), max: Math.round(max) };
}
export function calorieLabel(days: DietDay[]) {
  const r = calorieRange(days);
  return r ? `${r.min === r.max ? r.min : `${r.min}–${r.max}`} kcal/día` : 'Calorías pendientes de calcular';
}
export function gramsFromQuantity(q: string | undefined): number | null {
  const match = (q || '').trim().match(/^(\d+(?:[.,]\d+)?)\s*(g|gr|gramos|kg)\b/i);
  return match ? Number(match[1].replace(',', '.')) * (match[2].toLowerCase() === 'kg' ? 1000 : 1) : null;
}
export function recipeGrams(lib: any): number | null {
  const refs = Array.isArray(lib.bedca_refs) ? lib.bedca_refs : [];
  const total = refs.reduce((s: number, r: any) => s + (Number(r.grams) || 0), 0);
  if (total > 0) return total;
  const matches = [...String(lib.ingredients || '').matchAll(/(\d+(?:[.,]\d+)?)\s*g\b/gi)];
  return matches.length ? matches.reduce((s, m) => s + Number(m[1].replace(',', '.')), 0) : null;
}
export function scaleMeal(m: DietMeal, factor: number): DietMeal {
  if (!Number.isFinite(factor) || factor <= 0) throw new Error('Cantidad no válida');
  return { ...m, ...Object.fromEntries(['calories', 'protein_g', 'carbs_g', 'fats_g'].map(k => [k, m[k] == null ? null : Math.round(Number(m[k]) * factor * (k === 'calories' ? 1 : 10)) / (k === 'calories' ? 1 : 10)])),
    ingredients_detail: m.ingredients_detail?.map(i => ({ ...i, grams: Math.round(Number(i.grams) * factor * 10) / 10, household: '' })) || null };
}
function foodKey(m: DietMeal) { return `${typeOf(m)}:${normalize(m.name || m.meal_id || '')}`; }
export function weekSignatures(days: DietDay[]) {
  const result: string[] = [];
  for (let i = 0; i < days.length; i += 7) result.push([...new Set(days.slice(i, i + 7).flatMap(d => (d.meals || []).map(foodKey)))].sort().join('|'));
  return result;
}
export function assertDietVariety(days: DietDay[], previous: DietDay[][]) {
  const signatures = weekSignatures(days);
  const history = previous.flatMap(weekSignatures);
  if (signatures.some((s, i) => !s || history.includes(s) || signatures.indexOf(s) !== i)) {
    throw new Error('El menú repite los platos de otro plan o semana. Genera un menú con comidas diferentes.');
  }
}
export function assertCompleteDiet(days: DietDay[], expected: number) {
  if (days.length !== expected) throw new Error('El plan generado no contiene todos los días solicitados.');
  for (const d of days) {
    for (const type of ['breakfast', 'lunch', 'snack', 'dinner']) {
      const items = d.meals.filter(m => typeOf(m) === type);
      if (items.length !== 2 || new Set(items.map(foodKey)).size !== 2) throw new Error('Cada comida debe tener dos platos diferentes.');
    }
  }
  if (!calorieRange(days)) throw new Error('Faltan calorías verificables en las comidas; no se ha guardado el plan.');
}
