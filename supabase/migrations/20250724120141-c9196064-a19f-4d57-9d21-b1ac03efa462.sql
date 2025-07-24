-- Create table to track user modal interactions
CREATE TABLE public.user_modal_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  modal_type TEXT NOT NULL,
  shown_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, modal_type)
);

-- Enable RLS
ALTER TABLE public.user_modal_interactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own modal interactions
CREATE POLICY "Users can view own modal interactions" 
ON public.user_modal_interactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own modal interactions
CREATE POLICY "Users can insert own modal interactions" 
ON public.user_modal_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own modal interactions
CREATE POLICY "Users can update own modal interactions" 
ON public.user_modal_interactions 
FOR UPDATE 
USING (auth.uid() = user_id);