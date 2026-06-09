// BEDCA (Base de Datos Española de Composición de Alimentos) lookup with cache + fallback table.
// Public endpoint: https://www.bedca.net/bdpub/procquery.php (XML POST)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export interface FoodMacros {
  kcal_100g: number;
  protein_g_100g: number;
  carbs_g_100g: number;
  fats_g_100g: number;
  source: "cache" | "bedca" | "fallback" | "estimated";
  bedca_id?: string;
  name_used: string;
}

// Curated fallback table (per 100 g, typical Spanish foods). Used when BEDCA fails.
const FALLBACK: Record<string, Omit<FoodMacros, "source" | "name_used">> = {
  "pollo": { kcal_100g: 165, protein_g_100g: 31, carbs_g_100g: 0, fats_g_100g: 3.6 },
  "pechuga de pollo": { kcal_100g: 165, protein_g_100g: 31, carbs_g_100g: 0, fats_g_100g: 3.6 },
  "pavo": { kcal_100g: 135, protein_g_100g: 30, carbs_g_100g: 0, fats_g_100g: 1 },
  "ternera": { kcal_100g: 217, protein_g_100g: 26, carbs_g_100g: 0, fats_g_100g: 12 },
  "solomillo": { kcal_100g: 165, protein_g_100g: 23, carbs_g_100g: 0, fats_g_100g: 8 },
  "cerdo": { kcal_100g: 242, protein_g_100g: 27, carbs_g_100g: 0, fats_g_100g: 14 },
  "lomo de cerdo": { kcal_100g: 175, protein_g_100g: 22, carbs_g_100g: 0, fats_g_100g: 9 },
  "jamón cocido": { kcal_100g: 110, protein_g_100g: 18, carbs_g_100g: 1, fats_g_100g: 4 },
  "jamón serrano": { kcal_100g: 241, protein_g_100g: 31, carbs_g_100g: 0, fats_g_100g: 13 },
  "atún": { kcal_100g: 132, protein_g_100g: 28, carbs_g_100g: 0, fats_g_100g: 1 },
  "atún en conserva": { kcal_100g: 116, protein_g_100g: 26, carbs_g_100g: 0, fats_g_100g: 1 },
  "salmón": { kcal_100g: 208, protein_g_100g: 20, carbs_g_100g: 0, fats_g_100g: 13 },
  "merluza": { kcal_100g: 71, protein_g_100g: 17, carbs_g_100g: 0, fats_g_100g: 0.4 },
  "bacalao": { kcal_100g: 82, protein_g_100g: 18, carbs_g_100g: 0, fats_g_100g: 0.7 },
  "huevo": { kcal_100g: 155, protein_g_100g: 13, carbs_g_100g: 1.1, fats_g_100g: 11 },
  "clara de huevo": { kcal_100g: 52, protein_g_100g: 11, carbs_g_100g: 0.7, fats_g_100g: 0.2 },
  "leche entera": { kcal_100g: 61, protein_g_100g: 3.2, carbs_g_100g: 4.8, fats_g_100g: 3.3 },
  "leche desnatada": { kcal_100g: 35, protein_g_100g: 3.4, carbs_g_100g: 5, fats_g_100g: 0.1 },
  "leche": { kcal_100g: 50, protein_g_100g: 3.3, carbs_g_100g: 4.8, fats_g_100g: 1.5 },
  "yogur natural": { kcal_100g: 59, protein_g_100g: 3.5, carbs_g_100g: 4.7, fats_g_100g: 3.3 },
  "yogur griego": { kcal_100g: 97, protein_g_100g: 9, carbs_g_100g: 4, fats_g_100g: 5 },
  "queso fresco": { kcal_100g: 98, protein_g_100g: 11, carbs_g_100g: 3.4, fats_g_100g: 4.3 },
  "queso curado": { kcal_100g: 402, protein_g_100g: 25, carbs_g_100g: 1, fats_g_100g: 33 },
  "arroz blanco": { kcal_100g: 130, protein_g_100g: 2.7, carbs_g_100g: 28, fats_g_100g: 0.3 },
  "arroz integral": { kcal_100g: 123, protein_g_100g: 2.7, carbs_g_100g: 26, fats_g_100g: 1 },
  "arroz": { kcal_100g: 130, protein_g_100g: 2.7, carbs_g_100g: 28, fats_g_100g: 0.3 },
  "pasta": { kcal_100g: 131, protein_g_100g: 5, carbs_g_100g: 25, fats_g_100g: 1.1 },
  "pasta integral": { kcal_100g: 124, protein_g_100g: 5.3, carbs_g_100g: 25, fats_g_100g: 1.4 },
  "pan": { kcal_100g: 265, protein_g_100g: 9, carbs_g_100g: 49, fats_g_100g: 3.2 },
  "pan integral": { kcal_100g: 247, protein_g_100g: 13, carbs_g_100g: 41, fats_g_100g: 3.4 },
  "avena": { kcal_100g: 389, protein_g_100g: 17, carbs_g_100g: 66, fats_g_100g: 7 },
  "copos de avena": { kcal_100g: 389, protein_g_100g: 17, carbs_g_100g: 66, fats_g_100g: 7 },
  "patata": { kcal_100g: 77, protein_g_100g: 2, carbs_g_100g: 17, fats_g_100g: 0.1 },
  "boniato": { kcal_100g: 86, protein_g_100g: 1.6, carbs_g_100g: 20, fats_g_100g: 0.1 },
  "lentejas": { kcal_100g: 116, protein_g_100g: 9, carbs_g_100g: 20, fats_g_100g: 0.4 },
  "garbanzos": { kcal_100g: 164, protein_g_100g: 8.9, carbs_g_100g: 27, fats_g_100g: 2.6 },
  "alubias": { kcal_100g: 127, protein_g_100g: 9, carbs_g_100g: 23, fats_g_100g: 0.5 },
  "judías": { kcal_100g: 127, protein_g_100g: 9, carbs_g_100g: 23, fats_g_100g: 0.5 },
  "brócoli": { kcal_100g: 34, protein_g_100g: 2.8, carbs_g_100g: 7, fats_g_100g: 0.4 },
  "espinacas": { kcal_100g: 23, protein_g_100g: 2.9, carbs_g_100g: 3.6, fats_g_100g: 0.4 },
  "lechuga": { kcal_100g: 15, protein_g_100g: 1.4, carbs_g_100g: 2.9, fats_g_100g: 0.2 },
  "tomate": { kcal_100g: 18, protein_g_100g: 0.9, carbs_g_100g: 3.9, fats_g_100g: 0.2 },
  "pepino": { kcal_100g: 16, protein_g_100g: 0.7, carbs_g_100g: 3.6, fats_g_100g: 0.1 },
  "zanahoria": { kcal_100g: 41, protein_g_100g: 0.9, carbs_g_100g: 10, fats_g_100g: 0.2 },
  "calabacín": { kcal_100g: 17, protein_g_100g: 1.2, carbs_g_100g: 3.1, fats_g_100g: 0.3 },
  "pimiento": { kcal_100g: 31, protein_g_100g: 1, carbs_g_100g: 6, fats_g_100g: 0.3 },
  "cebolla": { kcal_100g: 40, protein_g_100g: 1.1, carbs_g_100g: 9, fats_g_100g: 0.1 },
  "champiñón": { kcal_100g: 22, protein_g_100g: 3.1, carbs_g_100g: 3.3, fats_g_100g: 0.3 },
  "manzana": { kcal_100g: 52, protein_g_100g: 0.3, carbs_g_100g: 14, fats_g_100g: 0.2 },
  "plátano": { kcal_100g: 89, protein_g_100g: 1.1, carbs_g_100g: 23, fats_g_100g: 0.3 },
  "naranja": { kcal_100g: 47, protein_g_100g: 0.9, carbs_g_100g: 12, fats_g_100g: 0.1 },
  "fresa": { kcal_100g: 32, protein_g_100g: 0.7, carbs_g_100g: 7.7, fats_g_100g: 0.3 },
  "arándanos": { kcal_100g: 57, protein_g_100g: 0.7, carbs_g_100g: 14, fats_g_100g: 0.3 },
  "aguacate": { kcal_100g: 160, protein_g_100g: 2, carbs_g_100g: 9, fats_g_100g: 15 },
  "aceite de oliva": { kcal_100g: 884, protein_g_100g: 0, carbs_g_100g: 0, fats_g_100g: 100 },
  "almendras": { kcal_100g: 579, protein_g_100g: 21, carbs_g_100g: 22, fats_g_100g: 50 },
  "nueces": { kcal_100g: 654, protein_g_100g: 15, carbs_g_100g: 14, fats_g_100g: 65 },
  "cacahuetes": { kcal_100g: 567, protein_g_100g: 26, carbs_g_100g: 16, fats_g_100g: 49 },
  "mantequilla de cacahuete": { kcal_100g: 588, protein_g_100g: 25, carbs_g_100g: 20, fats_g_100g: 50 },
  "chocolate negro": { kcal_100g: 546, protein_g_100g: 4.9, carbs_g_100g: 61, fats_g_100g: 31 },
  "miel": { kcal_100g: 304, protein_g_100g: 0.3, carbs_g_100g: 82, fats_g_100g: 0 },
  "azúcar": { kcal_100g: 387, protein_g_100g: 0, carbs_g_100g: 100, fats_g_100g: 0 },
  "harina de avena": { kcal_100g: 389, protein_g_100g: 17, carbs_g_100g: 66, fats_g_100g: 7 },
  "proteína whey": { kcal_100g: 400, protein_g_100g: 80, carbs_g_100g: 8, fats_g_100g: 5 },
  "tofu": { kcal_100g: 76, protein_g_100g: 8, carbs_g_100g: 1.9, fats_g_100g: 4.8 },
};

export function normalize(name: string): string {
  return name.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ").trim();
}

function fallbackLookup(name: string): { macros: Omit<FoodMacros, "source" | "name_used">; key: string } | null {
  const n = normalize(name);
  // direct match
  for (const k of Object.keys(FALLBACK)) {
    if (normalize(k) === n) return { macros: FALLBACK[k], key: k };
  }
  // contains match (longest first)
  const keys = Object.keys(FALLBACK).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (n.includes(normalize(k))) return { macros: FALLBACK[k], key: k };
  }
  return null;
}

async function queryBedca(name: string): Promise<{ id: string; macros: Omit<FoodMacros, "source" | "name_used"> } | null> {
  try {
    // 1) search by name
    const searchXml = `<?xml version="1.0" encoding="UTF-8"?>
<foodquery><type>f</type><string></string><max>5</max><order><field1 name="f_ori_name" order="ASC"/></order>
<fields><field1 name="f_id"/><field2 name="f_ori_name"/></fields>
<condition><cond1><left1 name="f_ori_name"/><op1 rel="LIKE"/><right1 value="${name.replace(/[<>&"']/g, "")}"/></cond1></condition>
</foodquery>`;
    const sRes = await fetch("https://www.bedca.net/bdpub/procquery.php", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: searchXml,
      signal: AbortSignal.timeout(5000),
    });
    if (!sRes.ok) return null;
    const sXml = await sRes.text();
    const idMatch = sXml.match(/<f_id>(\d+)<\/f_id>/);
    if (!idMatch) return null;
    const id = idMatch[1];

    // 2) fetch components
    const fxml = `<?xml version="1.0" encoding="UTF-8"?>
<foodquery><type>f</type><string></string><max>1</max><order/>
<fields><field1 name="f_id"/><field2 name="f_ori_name"/><field3 name="c_id"/><field4 name="c_ori_name"/><field5 name="best_location"/></fields>
<condition><cond1><left1 name="f_id"/><op1 rel="EQUAL"/><right1 value="${id}"/></cond1></condition>
</foodquery>`;
    const fRes = await fetch("https://www.bedca.net/bdpub/procquery.php", {
      method: "POST", headers: { "Content-Type": "text/xml" }, body: fxml,
      signal: AbortSignal.timeout(5000),
    });
    if (!fRes.ok) return null;
    const fXml = await fRes.text();

    // Parse components by code: 226=energy kcal, 215=protein, 207=carbs, 211=fat
    const extract = (code: string): number | null => {
      const re = new RegExp(`<c_id>${code}<\\/c_id>[\\s\\S]*?<best_location>([\\d.]+)<\\/best_location>`);
      const m = fXml.match(re);
      return m ? parseFloat(m[1]) : null;
    };
    const kcal = extract("226");
    const protein = extract("215");
    const carbs = extract("207");
    const fat = extract("211");
    if (kcal == null || protein == null || carbs == null || fat == null) return null;
    return { id, macros: { kcal_100g: kcal, protein_g_100g: protein, carbs_g_100g: carbs, fats_g_100g: fat } };
  } catch (e) {
    console.warn("BEDCA query failed for", name, e instanceof Error ? e.message : e);
    return null;
  }
}

export async function lookupFood(
  admin: ReturnType<typeof createClient>,
  name: string,
): Promise<FoodMacros> {
  const key = normalize(name);
  if (!key) {
    return { kcal_100g: 0, protein_g_100g: 0, carbs_g_100g: 0, fats_g_100g: 0, source: "estimated", name_used: name };
  }

  // 1) cache
  const { data: cached } = await admin
    .from("bedca_foods_cache")
    .select("*")
    .eq("name_normalized", key)
    .maybeSingle();
  if (cached && cached.found) {
    return {
      kcal_100g: Number(cached.kcal_100g), protein_g_100g: Number(cached.protein_g_100g),
      carbs_g_100g: Number(cached.carbs_g_100g), fats_g_100g: Number(cached.fats_g_100g),
      source: "cache", bedca_id: cached.bedca_id ?? undefined, name_used: name,
    };
  }

  // 2) BEDCA live
  const bedca = await queryBedca(name);
  if (bedca) {
    await admin.from("bedca_foods_cache").upsert({
      name_normalized: key, query: name, bedca_id: bedca.id, found: true,
      kcal_100g: bedca.macros.kcal_100g, protein_g_100g: bedca.macros.protein_g_100g,
      carbs_g_100g: bedca.macros.carbs_g_100g, fats_g_100g: bedca.macros.fats_g_100g,
    }, { onConflict: "name_normalized" });
    return { ...bedca.macros, source: "bedca", bedca_id: bedca.id, name_used: name };
  }

  // 3) fallback table
  const fb = fallbackLookup(name);
  if (fb) {
    await admin.from("bedca_foods_cache").upsert({
      name_normalized: key, query: name, found: true,
      kcal_100g: fb.macros.kcal_100g, protein_g_100g: fb.macros.protein_g_100g,
      carbs_g_100g: fb.macros.carbs_g_100g, fats_g_100g: fb.macros.fats_g_100g,
    }, { onConflict: "name_normalized" });
    return { ...fb.macros, source: "fallback", name_used: name };
  }

  // 4) estimated zeros
  return { kcal_100g: 0, protein_g_100g: 0, carbs_g_100g: 0, fats_g_100g: 0, source: "estimated", name_used: name };
}

export interface Ingredient { ingredient_name: string; grams: number; }
export interface ComputedMeal {
  kcal: number; protein_g: number; carbs_g: number; fats_g: number;
  ingredients_resolved: { name: string; grams: number; source: string; bedca_id?: string }[];
}

export async function computeMealFromIngredients(
  admin: ReturnType<typeof createClient>,
  ingredients: Ingredient[],
): Promise<ComputedMeal> {
  let kcal = 0, p = 0, c = 0, f = 0;
  const resolved: ComputedMeal["ingredients_resolved"] = [];
  for (const ing of ingredients) {
    if (!ing?.ingredient_name || !(ing.grams > 0)) continue;
    const macros = await lookupFood(admin, ing.ingredient_name);
    const factor = ing.grams / 100;
    kcal += macros.kcal_100g * factor;
    p += macros.protein_g_100g * factor;
    c += macros.carbs_g_100g * factor;
    f += macros.fats_g_100g * factor;
    resolved.push({ name: ing.ingredient_name, grams: ing.grams, source: macros.source, bedca_id: macros.bedca_id });
  }
  return {
    kcal: Math.round(kcal),
    protein_g: Math.round(p * 10) / 10,
    carbs_g: Math.round(c * 10) / 10,
    fats_g: Math.round(f * 10) / 10,
    ingredients_resolved: resolved,
  };
}