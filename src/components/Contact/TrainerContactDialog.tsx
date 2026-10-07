import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { trainerContact } from '@/lib/trainerChat';

export default function TrainerContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[calc(100%-2rem)] bg-[hsl(var(--dark-surface))] border-[hsl(var(--dark-border))] text-[hsl(var(--text-primary))]">
      <DialogHeader><DialogTitle>Contactar con José Antonio</DialogTitle><DialogDescription className="text-[hsl(var(--text-secondary))]">José Antonio Figueiras Núñez</DialogDescription></DialogHeader>
      <div className="grid gap-3">
        <Button asChild variant="outline" className="justify-start bg-transparent border-[hsl(var(--dark-border))] hover:bg-[hsl(var(--dark-card))] hover:text-[hsl(var(--text-primary))]"><a href={trainerContact.phoneLink}><Phone className="w-4 h-4 mr-3" />{trainerContact.phone}</a></Button>
        <Button asChild variant="outline" className="justify-start bg-transparent border-[hsl(var(--dark-border))] hover:bg-[hsl(var(--dark-card))] hover:text-[hsl(var(--text-primary))]"><a href={`mailto:${trainerContact.email}`}><Mail className="w-4 h-4 mr-3 shrink-0" /><span className="break-all">{trainerContact.email}</span></a></Button>
      </div>
    </DialogContent>
  </Dialog>;
}