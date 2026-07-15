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
  stripeUrl: string;
}

export const PLANS: PlanConfig[] = [
  {
    id: 'explorador',
    name: 'Explorador',
    tagline: 'Persona que empieza y necesita orden',
    price: 29,
    priceLabel: '29€',
    duration: 'Pago único',
    highlighted: false,
    features: [
      'Base estructural',
      '7 días',
      'Guía base de alimentación',
      'Orientación general',
      'Sin seguimiento',
    ],
    stripeUrl: 'https://buy.stripe.com/28EcN62DHgtIgxtfE46wE00',
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
    stripeUrl: 'https://buy.stripe.com/7sYdRa7Y13GW9513Vm6wE01',
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
    stripeUrl: 'https://buy.stripe.com/6oUbJ21zDfpE0yvbnO6wE02',
  },
];

export const getPlanById = (id: string): PlanConfig | undefined =>
  PLANS.find(p => p.id === id);
