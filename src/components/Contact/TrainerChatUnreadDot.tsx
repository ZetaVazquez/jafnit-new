import { useTrainerChatUnread } from '@/hooks/useTrainerChatUnread';

export default function TrainerChatUnreadDot() {
  const unread = useTrainerChatUnread();
  if (!unread) return null;
  return <span role="status" aria-label="Nuevo mensaje del entrenador" className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--notification-unread))] ring-2 ring-[hsl(var(--dark-surface))]">
    <span className="sr-only">Tienes mensajes del entrenador sin leer</span>
  </span>;
}