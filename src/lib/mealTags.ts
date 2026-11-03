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

// Normaliza para comparar sin distinguir mayúsculas ni acentos: «perdida»
// encuentra «Pérdida de peso», «SIN LACTOSA» encuentra «Sin lactosa».
export function normalizeMealTag(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Filtra las opciones del desplegable por lo escrito en el buscador.
// Cada palabra escrita debe aparecer en la etiqueta; el orden no importa.
export function filterMealTagOptions(options: string[], query: string): string[] {
  const tokens = normalizeMealTag(query).split(' ').filter(Boolean);
  if (tokens.length === 0) return [...options];
  return options.filter(option => {
    const normalized = normalizeMealTag(option);
    return tokens.every(token => normalized.includes(token));
  });
}


export function toggleMealTag(tags: string[] | null, tag: string, selected: boolean): string[] {
  const current = tags ?? [];
  return selected
    ? current.includes(tag) ? [...current] : [...current, tag]
    : current.filter(value => value !== tag);
}
