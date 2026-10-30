// ============= Full file contents =============

// Lista fija de opciones del desplegable. Las etiquetas guardadas que no están
// aquí (p. ej. «Salado», «Dulce») se conservan en los datos, pero no se ofrecen
// ni se muestran como opciones nuevas en el desplegable.
export const MEAL_TAG_OPTIONS = [
  'Ganancia de masa muscular',
  'Pérdida de peso',
  'Vegano',
  'Vegetariano',
  'Sin gluten',
  'Sin lactosa',
  'Keto-friendly',
  'Sin frutos secos',
];

// El desplegable ofrece únicamente la lista fija. Las etiquetas existentes que
// coinciden con una opción aparecen seleccionadas al editar; las demás se
// conservan tal cual en la comida sin mostrarse como opciones.
export function mealTagOptions(_existing: (string[] | null)[]): string[] {
  return [...MEAL_TAG_OPTIONS];
}

export function toggleMealTag(tags: string[] | null, tag: string, selected: boolean): string[] {
  const current = tags ?? [];
  return selected
    ? current.includes(tag) ? [...current] : [...current, tag]
    : current.filter(value => value !== tag);
}
