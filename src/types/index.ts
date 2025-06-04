
export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export interface QuestionnaireQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'text' | 'number';
  options?: string[];
  required: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  image?: string;
}

export interface FAQ {
  id: string;
  category: 'Precio' | 'General' | 'Nutricion' | 'Entrenamiento';
  question: string;
  answer: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  type: 'news' | 'instagram';
}
