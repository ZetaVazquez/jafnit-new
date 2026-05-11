export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      admin_earnings: {
        Row: {
          admin_id: string | null
          amount: number
          created_at: string
          description: string | null
          earning_date: string
          id: string
        }
        Insert: {
          admin_id?: string | null
          amount?: number
          created_at?: string
          description?: string | null
          earning_date?: string
          id?: string
        }
        Update: {
          admin_id?: string | null
          amount?: number
          created_at?: string
          description?: string | null
          earning_date?: string
          id?: string
        }
        Relationships: []
      }
      admin_news: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          image_url: string | null
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      body_measurements: {
        Row: {
          body_fat_percentage: number | null
          chest_circumference: number | null
          created_at: string
          hip_circumference: number | null
          id: string
          measured_at: string
          muscle_mass: number | null
          notes: string | null
          user_id: string
          waist_circumference: number | null
          weight: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          chest_circumference?: number | null
          created_at?: string
          hip_circumference?: number | null
          id?: string
          measured_at?: string
          muscle_mass?: number | null
          notes?: string | null
          user_id: string
          waist_circumference?: number | null
          weight?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          chest_circumference?: number | null
          created_at?: string
          hip_circumference?: number | null
          id?: string
          measured_at?: string
          muscle_mass?: number | null
          notes?: string | null
          user_id?: string
          waist_circumference?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      client_forms: {
        Row: {
          acquisition_source: string | null
          address: string | null
          age: number | null
          birth_date: string | null
          bmi: number | null
          body_fat_percentage: number | null
          city: string | null
          commitment_time: string | null
          contracted_program: string | null
          created_at: string
          current_diet_type: string | null
          current_supplements: string | null
          current_training: string | null
          daily_activity_level: string | null
          daily_water_intake: string | null
          dni_nie: string | null
          email: string | null
          food_restrictions: string | null
          full_name: string | null
          gender: string | null
          height_cm: number | null
          hip_perimeter: number | null
          id: string
          initial_weight: number | null
          intolerances_allergies: string | null
          main_objective: string | null
          meals_per_day: number | null
          measurements_date: string | null
          next_renewal: string | null
          ninety_day_goal: string | null
          pathologies: string | null
          payment_method: string | null
          personal_motivation: string | null
          phone: string | null
          physical_limitations: string | null
          professional_notes: string | null
          resting_heart_rate: number | null
          secondary_objectives: string | null
          start_date: string | null
          training_availability: string | null
          user_id: string
          waist_perimeter: number | null
        }
        Insert: {
          acquisition_source?: string | null
          address?: string | null
          age?: number | null
          birth_date?: string | null
          bmi?: number | null
          body_fat_percentage?: number | null
          city?: string | null
          commitment_time?: string | null
          contracted_program?: string | null
          created_at?: string
          current_diet_type?: string | null
          current_supplements?: string | null
          current_training?: string | null
          daily_activity_level?: string | null
          daily_water_intake?: string | null
          dni_nie?: string | null
          email?: string | null
          food_restrictions?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          hip_perimeter?: number | null
          id?: string
          initial_weight?: number | null
          intolerances_allergies?: string | null
          main_objective?: string | null
          meals_per_day?: number | null
          measurements_date?: string | null
          next_renewal?: string | null
          ninety_day_goal?: string | null
          pathologies?: string | null
          payment_method?: string | null
          personal_motivation?: string | null
          phone?: string | null
          physical_limitations?: string | null
          professional_notes?: string | null
          resting_heart_rate?: number | null
          secondary_objectives?: string | null
          start_date?: string | null
          training_availability?: string | null
          user_id: string
          waist_perimeter?: number | null
        }
        Update: {
          acquisition_source?: string | null
          address?: string | null
          age?: number | null
          birth_date?: string | null
          bmi?: number | null
          body_fat_percentage?: number | null
          city?: string | null
          commitment_time?: string | null
          contracted_program?: string | null
          created_at?: string
          current_diet_type?: string | null
          current_supplements?: string | null
          current_training?: string | null
          daily_activity_level?: string | null
          daily_water_intake?: string | null
          dni_nie?: string | null
          email?: string | null
          food_restrictions?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          hip_perimeter?: number | null
          id?: string
          initial_weight?: number | null
          intolerances_allergies?: string | null
          main_objective?: string | null
          meals_per_day?: number | null
          measurements_date?: string | null
          next_renewal?: string | null
          ninety_day_goal?: string | null
          pathologies?: string | null
          payment_method?: string | null
          personal_motivation?: string | null
          phone?: string | null
          physical_limitations?: string | null
          professional_notes?: string | null
          resting_heart_rate?: number | null
          secondary_objectives?: string | null
          start_date?: string | null
          training_availability?: string | null
          user_id?: string
          waist_perimeter?: number | null
        }
        Relationships: []
      }
      daily_goals: {
        Row: {
          created_at: string
          description: string | null
          goal_type: string
          id: string
          is_active: boolean | null
          target_unit: string | null
          target_value: number | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          goal_type: string
          id?: string
          is_active?: boolean | null
          target_unit?: string | null
          target_value?: number | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          goal_type?: string
          id?: string
          is_active?: boolean | null
          target_unit?: string | null
          target_value?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          date: string
          goal_id: string | null
          id: string
          notes: string | null
          user_id: string
          value_achieved: number | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          date?: string
          goal_id?: string | null
          id?: string
          notes?: string | null
          user_id: string
          value_achieved?: number | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          date?: string
          goal_id?: string | null
          id?: string
          notes?: string | null
          user_id?: string
          value_achieved?: number | null
        }
        Relationships: []
      }
      diet_plans: {
        Row: {
          assigned_to: string | null
          calories_target: number | null
          created_at: string
          created_by: string | null
          description: string | null
          generated_by_ai: boolean
          id: string
          meal_plan: Json | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          calories_target?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          generated_by_ai?: boolean
          id?: string
          meal_plan?: Json | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          calories_target?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          generated_by_ai?: boolean
          id?: string
          meal_plan?: Json | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_plans_assigned_to_profiles_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plans_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises_library: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string
          equipment: string | null
          id: string
          instructions: string | null
          muscle_group: string
          name: string
          thumbnail_url: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string
          equipment?: string | null
          id?: string
          instructions?: string | null
          muscle_group: string
          name: string
          thumbnail_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string
          equipment?: string | null
          id?: string
          instructions?: string | null
          muscle_group?: string
          name?: string
          thumbnail_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      guide_purchases: {
        Row: {
          amount_paid: number
          created_at: string
          guide_id: string
          id: string
          purchased_at: string
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number
          created_at?: string
          guide_id: string
          id?: string
          purchased_at?: string
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          guide_id?: string
          id?: string
          purchased_at?: string
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      guides: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          discounted_price: number
          id: string
          image_url: string | null
          is_active: boolean
          pdf_url: string
          regular_price: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          discounted_price?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          pdf_url: string
          regular_price?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          discounted_price?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          pdf_url?: string
          regular_price?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      initial_evaluations: {
        Row: {
          block_1_identification: Json
          block_2_health_screening: Json
          block_3_dietary_history: Json
          block_4_training_profile: Json
          block_5_lifestyle_recovery: Json
          block_6_medical_clinical: Json
          block_7_hormonal_health: Json
          block_8_anthropometry: Json
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          block_1_identification?: Json
          block_2_health_screening?: Json
          block_3_dietary_history?: Json
          block_4_training_profile?: Json
          block_5_lifestyle_recovery?: Json
          block_6_medical_clinical?: Json
          block_7_hormonal_health?: Json
          block_8_anthropometry?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          block_1_identification?: Json
          block_2_health_screening?: Json
          block_3_dietary_history?: Json
          block_4_training_profile?: Json
          block_5_lifestyle_recovery?: Json
          block_6_medical_clinical?: Json
          block_7_hormonal_health?: Json
          block_8_anthropometry?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "initial_evaluations_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meals_library: {
        Row: {
          calories: number | null
          carbs_g: number | null
          created_at: string
          description: string | null
          diet_tags: string[] | null
          fats_g: number | null
          id: string
          image_url: string | null
          ingredients: string | null
          meal_type: string
          name: string
          protein_g: number | null
          updated_at: string
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          created_at?: string
          description?: string | null
          diet_tags?: string[] | null
          fats_g?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string | null
          meal_type: string
          name: string
          protein_g?: number | null
          updated_at?: string
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          created_at?: string
          description?: string | null
          diet_tags?: string[] | null
          fats_g?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string | null
          meal_type?: string
          name?: string
          protein_g?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pending_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          payment_method: string
          payment_reference: string | null
          plan_type: string
          receipt_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          payment_reference?: string | null
          plan_type: string
          receipt_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          payment_reference?: string | null
          plan_type?: string
          receipt_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_payments_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          description: string | null
          email: string
          id: string
          name: string
          profile_image_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          email: string
          id: string
          name?: string
          profile_image_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          name?: string
          profile_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          activity_level: string | null
          age: number | null
          created_at: string
          dietary_preferences: string | null
          exercise_frequency: string | null
          health_conditions: string | null
          health_goals: string | null
          height: number | null
          id: string
          user_id: string
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          created_at?: string
          dietary_preferences?: string | null
          exercise_frequency?: string | null
          health_conditions?: string | null
          health_goals?: string | null
          height?: number | null
          id?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          created_at?: string
          dietary_preferences?: string | null
          exercise_frequency?: string | null
          health_conditions?: string | null
          health_goals?: string | null
          height?: number | null
          id?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          stripe_customer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          stripe_customer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          stripe_customer_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_products: {
        Row: {
          active: boolean | null
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          interval_type: string | null
          name: string
          plan_type: string
          stripe_price_id: string
          stripe_product_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          interval_type?: string | null
          name: string
          plan_type?: string
          stripe_price_id: string
          stripe_product_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          interval_type?: string | null
          name?: string
          plan_type?: string
          stripe_price_id?: string
          stripe_product_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          end_date: string | null
          id: string
          payment_method: string | null
          plan_type: string
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          end_date?: string | null
          id?: string
          payment_method?: string | null
          plan_type?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_date?: string | null
          id?: string
          payment_method?: string | null
          plan_type?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_acceptances: {
        Row: {
          accepted_at: string
          created_at: string
          id: string
          ip_address: string | null
          terms_version: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          terms_version?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          terms_version?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_modal_interactions: {
        Row: {
          created_at: string
          id: string
          modal_type: string
          shown_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          modal_type: string
          shown_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          modal_type?: string
          shown_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_testimonials: {
        Row: {
          comment: string
          created_at: string
          id: string
          name: string
          rating: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          name: string
          rating?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          name?: string
          rating?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          exercises: Json | null
          generated_by_ai: boolean
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          exercises?: Json | null
          generated_by_ai?: boolean
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          exercises?: Json | null
          generated_by_ai?: boolean
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_assigned_to_profiles_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plans_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_approve_diet_plan: {
        Args: { p_id: string }
        Returns: {
          assigned_to: string | null
          calories_target: number | null
          created_at: string
          created_by: string | null
          description: string | null
          generated_by_ai: boolean
          id: string
          meal_plan: Json | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "diet_plans"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_approve_workout_plan: {
        Args: { p_id: string }
        Returns: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          exercises: Json | null
          generated_by_ai: boolean
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "workout_plans"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_delete_diet_plan: { Args: { p_id: string }; Returns: undefined }
      admin_delete_workout_plan: { Args: { p_id: string }; Returns: undefined }
      admin_update_diet_plan: {
        Args: {
          p_assigned_to: string
          p_calories_target: number
          p_description: string
          p_id: string
          p_meal_plan: Json
          p_status: string
          p_title: string
        }
        Returns: {
          assigned_to: string | null
          calories_target: number | null
          created_at: string
          created_by: string | null
          description: string | null
          generated_by_ai: boolean
          id: string
          meal_plan: Json | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "diet_plans"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_update_stripe_subscription_end_date: {
        Args: { p_new_end: string; p_subscription_id: string }
        Returns: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "stripe_subscriptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_update_subscription_end_date: {
        Args: { p_new_end: string; p_subscription_id: string }
        Returns: {
          amount: number
          created_at: string
          end_date: string | null
          id: string
          payment_method: string | null
          plan_type: string
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "subscriptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_update_workout_plan: {
        Args: {
          p_assigned_to: string
          p_description: string
          p_difficulty_level: string
          p_exercises: Json
          p_id: string
          p_status: string
          p_title: string
        }
        Returns: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          exercises: Json | null
          generated_by_ai: boolean
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "workout_plans"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_active_profiles: {
        Args: never
        Returns: {
          created_at: string
          description: string
          email: string
          id: string
          name: string
          profile_image_url: string
          updated_at: string
        }[]
      }
      get_user_subscription_status: {
        Args: { user_uuid: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_expired_subscriptions: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
