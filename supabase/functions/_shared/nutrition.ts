// Clinical nutrition calculations (Mifflin-St Jeor + macro split)

export interface Targets {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  bmr: number;
  tdee: number;
  goal: "deficit" | "maintenance" | "bulk";
  weight_kg: number;
  height_cm: number;
  age: number;
  gender: "male" | "female";
  activity_factor: number;
  is_estimated: boolean;
  notes: string[];
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function detectGender(v: unknown): "male" | "female" {
  const s = String(v ?? "").toLowerCase();
  if (s.startsWith("f") || s.includes("mujer") || s.includes("femen")) return "female";
  return "male";
}

function activityFactorFrom(block4: Record<string, unknown>, block1: Record<string, unknown>): number {
  const days = num(block4?.training_frequency) ?? 3;
  const work = String(block1?.work_type ?? "").toLowerCase();
  let base = 1.2;
  if (days >= 1 && days <= 2) base = 1.375;
  else if (days >= 3 && days <= 4) base = 1.55;
  else if (days >= 5 && days <= 6) base = 1.725;
  else if (days >= 7) base = 1.9;
  if (work.includes("muy activo")) base = Math.min(1.9, base + 0.1);
  else if (work.includes("activo")) base = Math.min(1.9, base + 0.05);
  return base;
}

function detectGoal(block1: Record<string, unknown>): "deficit" | "maintenance" | "bulk" {
  const text = [
    block1?.main_objective, block1?.short_term_objective,
    block1?.mid_term_objective, block1?.long_term_objective,
    block1?.real_priority,
  ].map((x) => String(x ?? "").toLowerCase()).join(" ");
  if (/(adelgaz|perder|déficit|deficit|bajar peso|grasa|definici)/.test(text)) return "deficit";
  if (/(volumen|ganar|hipertrofi|aumentar|masa|bulk)/.test(text)) return "bulk";
  return "maintenance";
}

export function computeTargets(initial: Record<string, any> | null): Targets | null {
  if (!initial) return null;
  const b1 = initial.block_1_identification ?? {};
  const b4 = initial.block_4_training_profile ?? {};
  const b8 = initial.block_8_anthropometry ?? {};

  const weight = num(b8.weight);
  const height = num(b8.height);
  const age = num(b1.age);
  if (!weight || !height || !age) return null;

  const gender = detectGender(b1.gender);
  const bmr = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const af = activityFactorFrom(b4, b1);
  const tdee = bmr * af;
  const goal = detectGoal(b1);

  let kcal = tdee;
  if (goal === "deficit") kcal = Math.max(tdee - 400, bmr * 1.1, gender === "female" ? 1200 : 1500);
  else if (goal === "bulk") kcal = tdee + 300;

  const proteinPerKg = goal === "deficit" ? 1.8 : goal === "bulk" ? 2.0 : 1.6;
  const protein_g = Math.round(proteinPerKg * weight);
  const fats_g = Math.max(Math.round((kcal * 0.25) / 9), Math.round(0.8 * weight));
  const remaining = kcal - (protein_g * 4 + fats_g * 9);
  const carbs_g = Math.max(Math.round(remaining / 4), 50);

  return {
    kcal: Math.round(kcal),
    protein_g, carbs_g, fats_g,
    bmr: Math.round(bmr), tdee: Math.round(tdee),
    goal, weight_kg: weight, height_cm: height, age, gender,
    activity_factor: af, is_estimated: false,
    notes: [`Fórmula Mifflin-St Jeor`, `Factor actividad ${af}`, `Objetivo: ${goal}`],
  };
}

export function genericTargets(): Targets {
  return {
    kcal: 2000, protein_g: 120, carbs_g: 225, fats_g: 67,
    bmr: 1500, tdee: 2000, goal: "maintenance",
    weight_kg: 70, height_cm: 170, age: 35, gender: "male",
    activity_factor: 1.4, is_estimated: true,
    notes: ["Sin datos de cuestionario: targets genéricos 2000 kcal"],
  };
}