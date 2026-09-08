export type PlanId = 'explorador' | 'constructor' | 'estratega';

export interface PlanConfig {
  id: PlanId;
  name: string;
  tagline: string;
  price: number;
  priceLabel: string;
  duration: string;
  highlighted: boolean;
  features: string[];
  /** Precio recurrente ya existente en Stripe (modo TEST) */
  priceId: string;
  productId: string;
}

export const PLANS: PlanConfig[] = [
  {
    id: 'explorador',
    name: 'Explorador',
    tagline: 'Persona que empieza y necesita orden',
    price: 29,
    priceLabel: '29€',
    duration: '/mes',
    highlighted: false,
    features: [
      'Base estructural',
      '7 días',
      'Guía base de alimentación',
      'Orientación general',
      'Sin seguimiento',
    ],
    priceId: 'price_1UDPmGPtWMY1We6RrAECdeee',
    productId: 'prod_ShAQhPIY5kIWxT',
  },
  {
    id: 'constructor',
    name: 'Constructor',
    tagline: 'Persona decidida que quiere aplicar método',
    price: 99,
    priceLabel: '99€',
    duration: '/mes',
    highlighted: true,
    features: [
      'Planificación estructurada',
      'Nivel medio',
      'Plan nutricional adaptado',
      'Rutina progresiva',
      'Evaluación y ajuste 1 a 1',
    ],
    priceId: 'price_1UDPokPtWMY1We6Rbk0m2rgQ',
    productId: 'prod_VDrXPMPW24DFWt',
  },
  {
    id: 'estratega',
    name: 'Estratega',
    tagline: 'Comprometida que busca transformación real',
    price: 297,
    priceLabel: '297€',
    duration: '/mes',
    highlighted: false,
    features: [
      'Acompañamiento completo y continuo',
      '12 semanas (90 días)',
      'Plan completo y personalizable',
      'Plan personalizado y progresivo',
      'Evaluaciones periódicas y ajustes estratégicos',
    ],
    priceId: 'price_1UDPpmPtWMY1We6Rq6wxFLF5',
    productId: 'prod_VDrYDsDuSQggep',
  },
];

export const getPlanById = (id: string): PlanConfig | undefined =>
  PLANS.find(p => p.id === id);

/** Mapa priceId -> planId, usado para saber qué plan tiene activo el cliente. */
export const PLAN_BY_PRICE_ID: Record<string, PlanId> = PLANS.reduce((acc, p) => {
  acc[p.priceId] = p.id;
  return acc;
}, {} as Record<string, PlanId>);

