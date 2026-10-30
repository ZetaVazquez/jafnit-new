export const MEAL_TAG_OPTIONS = [
  'Ganancia de masa muscular',
  'Pérdida de peso',
  'Vegano',
  'Vegetariano',
  'Sin gluten',
  'Sin lactosa',
];

export function mealTagOptions(existing: (string[] | null)[]): string[] {
  return [...new Set([...MEAL_TAG_OPTIONS, ...existing.flatMap(tags => tags ?? [])])];
}

export function toggleMealTag(tags: string[] | null, tag: string, selected: boolean): string[] {
  const current = tags ?? [];
  return selected
    ? current.includes(tag) ? [...current] : [...current, tag]
    : current.filter(value => value !== tag);
}