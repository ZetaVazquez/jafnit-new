
# Plan: Cálculo nutricional clínico + BEDCA + auto-creación de platos

## Objetivo
Que `generate-plans-from-questionnaire` deje de "ir a ojo": calcule calorías/macros con fórmulas validadas a partir del cuestionario, use BEDCA (Base de Datos Española de Composición de Alimentos) como fuente real de macros por ingrediente, y permita a la IA proponer platos nuevos que se añaden automáticamente a `meals_library`.

---

## 1. Cálculo clínico (no LLM)

Se hace en el edge function ANTES de llamar a la IA. La IA recibe los números, no los inventa.

**Inputs del cuestionario** (de `initial_evaluations`):
- Bloque 1: sexo, edad
- Bloque 4: nivel de actividad / días de entrenamiento
- Bloque 8: peso (kg), altura (cm)
- Objetivo: déficit / mantenimiento / volumen

**Fórmulas:**
1. **TMB** — Mifflin-St Jeor:
   - Hombre: `10·kg + 6.25·cm − 5·edad + 5`
   - Mujer: `10·kg + 6.25·cm − 5·edad − 161`
2. **GET** = TMB × factor de actividad (1.2 sedentario → 1.9 muy activo, mapeado desde bloque 4).
3. **Objetivo calórico**:
   - Déficit: GET − 400 kcal (mínimo TMB · 1.1, nunca <1200 ♀ / <1500 ♂)
   - Mantenimiento: GET
   - Volumen: GET + 300 kcal
4. **Macros**:
   - Proteína: 1.8 g/kg (déficit) · 1.6 g/kg (mant.) · 2.0 g/kg (volumen)
   - Grasa: 25% de calorías (mín 0.8 g/kg)
   - HC: resto

Si faltan datos del cuestionario → plan genérico 2000 kcal (como ahora).

---

## 2. Integración BEDCA

BEDCA expone un servicio web público (XML) en `https://www.bedca.net/bdpub/procquery.php`. Devuelve por alimento: kcal, proteína, HC, grasa, fibra, etc.

**Implementación:**
- Nueva tabla `bedca_foods_cache` (clave: nombre normalizado) para no martillear BEDCA y cachear resultados localmente.
  - Campos: `name_normalized`, `bedca_id`, `kcal_100g`, `protein_g_100g`, `carbs_g_100g`, `fats_g_100g`, `raw_json`.
- Helper en `supabase/functions/_shared/bedca.ts`:
  - `lookupFood(name)` → consulta cache, si no existe pide a BEDCA (XML POST), parsea, guarda y devuelve macros por 100 g.
- Fallback: si BEDCA no encuentra el alimento, se marca como `source: 'estimated'` y se usa estimación conservadora con un aviso al admin en el plato.

---

## 3. La IA puede crear platos nuevos

Hoy la IA está limitada a la biblioteca. Cambiamos el schema del tool:

**Tool `build_diet_plan`** acepta dos tipos de entrada de comida:
- `meal_id` existente, **o**
- `new_meal` con: `name`, `meal_type`, `ingredients_grams` = `[{ ingredient_name, grams }, ...]`, `preparation_notes`, opcional `diet_tags`.

**Flujo tras la respuesta de la IA:**
1. Para cada `new_meal`:
   - Por cada ingrediente → `bedca.lookupFood()` → macros reales por 100 g → multiplicar por gramos.
   - Sumar macros del plato.
   - Buscar duplicado en `meals_library` por nombre normalizado; si no existe, `INSERT` con `created_by_ai = true`, `source = 'bedca'`.
   - Usar el nuevo `id` en el plan.
2. Validar que el total diario del plan cuadra con `calories_target ±10%`; si no cuadra, ajustar gramos proporcionalmente (no relanzar IA).

**Resultado:** la biblioteca crece sola con macros verificados; los siguientes planes ya tienen más opciones reutilizables.

---

## 4. Cambios concretos

### DB (migración)
- `meals_library`: añadir `created_by_ai boolean default false`, `source text` (`'manual' | 'bedca' | 'estimated'`), `bedca_refs jsonb` (lista de ingredientes consultados).
- Nueva tabla `bedca_foods_cache` con RLS (lectura `authenticated`, escritura solo `service_role`).
- Índice único sobre `meals_library.name` (normalizado en minúsculas) para evitar duplicados.

### Edge function `generate-plans-from-questionnaire`
- Añadir bloque de cálculo clínico (sección 1) → produce `targets = { kcal, protein_g, carbs_g, fats_g }`.
- Pasar `targets` al system prompt como objetivos OBLIGATORIOS.
- Ampliar el JSON-schema del tool para aceptar `new_meal`.
- Tras recibir la respuesta: resolver `new_meal` con BEDCA, insertar en `meals_library`, enriquecer el plan.
- Devolver al cliente un resumen: `{ targets, created_meals_count }`.

### Nuevo shared module
- `supabase/functions/_shared/bedca.ts` (lookup + cache).
- `supabase/functions/_shared/nutrition.ts` (Mifflin-St Jeor, factores actividad, reparto macros).

### Frontend
- En el modal de generación con IA: mostrar los targets calculados (kcal/proteína/HC/grasa) antes y después.
- En `AdminMealLibrary`: badge "Auto-creado por IA (BEDCA)" para platos con `created_by_ai`.

---

## 5. Detalles técnicos / riesgos

- **BEDCA es lento y a veces inestable.** El cache local lo mitiga; la primera vez un plan puede tardar 5-15 s extra mientras se cachean ingredientes nuevos.
- **Idioma:** BEDCA está en español; la IA debe nombrar ingredientes en español estándar (ej. "pechuga de pollo", "arroz integral cocido"). Lo forzamos en el prompt.
- **Licencia BEDCA:** uso permitido citando la fuente. Añadir nota "Datos nutricionales: BEDCA" en el PDF del plan.
- **Alternativa si BEDCA falla:** se puede sustituir el helper por USDA FoodData Central (en inglés) sin tocar el resto. La arquitectura lo permite.

---

## Entregables
1. Migración SQL (tabla cache + columnas nuevas en `meals_library`).
2. `_shared/nutrition.ts` y `_shared/bedca.ts`.
3. Reescritura parcial de `generate-plans-from-questionnaire/index.ts`.
4. Ajustes UI menores en el modal de generación y `AdminMealLibrary`.

¿Procedo con esta implementación?
