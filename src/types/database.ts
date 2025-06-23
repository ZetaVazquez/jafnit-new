export interface Profile {
  id: string;
  name: string;
  email: string;
  description?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireResponse {
  id: string;
  user_id: string;
  age?: number;
  weight?: number;
  height?: number;
  activity_level?: string;
  health_goals?: string;
  dietary_preferences?: string;
  exercise_frequency?: string;
  health_conditions?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'monthly' | 'quarterly';
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  start_date?: string;
  end_date?: string;
  payment_method?: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface PendingPayment {
  id: string;
  user_id: string;
  plan_type: 'monthly' | 'quarterly';
  amount: number;
  payment_method: string;
  payment_reference?: string;
  receipt_url?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  profiles?: Profile | null;
}

export interface DietPlan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  meal_plan?: any;
  calories_target?: number;
  assigned_to?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  exercises?: any;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  assigned_to?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyGoal {
  id: string;
  user_id: string;
  goal_type: 'diet' | 'workout' | 'water' | 'sleep' | 'supplements' | 'custom';
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  is_active?: boolean;
  created_at: string;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  goal_id: string;
  date: string;
  completed?: boolean;
  value_achieved?: number;
  notes?: string;
  completed_at?: string;
  created_at: string;
}

export interface BodyMeasurement {
  id: string;
  user_id: string;
  weight?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  waist_circumference?: number;
  chest_circumference?: number;
  hip_circumference?: number;
  notes?: string;
  measured_at: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: 'login' | 'logout' | 'goal_completed' | 'measurement_added' | 'diet_viewed' | 'workout_completed';
  description?: string;
  metadata?: any;
  created_at: string;
}
