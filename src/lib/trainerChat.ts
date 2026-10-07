import { supabase } from '@/integrations/supabase/client';

export const trainerContact = { phone: '+34 697 754 823', phoneLink: 'tel:+34697754823', email: 'consultajafn@gmail.com' };
export type TrainerMessage = { id: string; session_id: string; sender_id: string; from_admin: boolean; body: string; created_at: string };
export type TrainerConversation = { id: string; client_name: string; client_email: string; client_closed: boolean; expires_at: string; last_message: string; last_at: string; unread_count: number };

export async function listTrainerChats(): Promise<TrainerConversation[]> {
  const { data, error } = await supabase.rpc('admin_list_trainer_chats');
  if (error) throw error;
  return data || [];
}
export async function readTrainerMessages(id: string): Promise<TrainerMessage[]> {
  const { data, error } = await supabase.rpc('read_trainer_chat', { p_session_id: id });
  if (error) throw error;
  return data || [];
}
export async function sendTrainerMessage(id: string | null, body: string): Promise<string> {
  const { data, error } = await supabase.rpc('send_trainer_message', { p_session_id: id, p_body: body });
  if (error) throw error;
  return data;
}
export async function closeTrainerChat(id: string) {
  const { error } = await supabase.rpc('close_trainer_chat', { p_session_id: id });
  if (error) throw error;
}