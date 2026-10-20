import { Button } from '@/components/ui/button';

export default function WorkoutDifficulty({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <div role="group" aria-label="Dificultad" className="flex flex-wrap gap-2">
    { [['beginner', 'Principiante'], ['intermediate', 'Intermedio'], ['advanced', 'Avanzado']].map(([level, label]) => (
      <Button key={level} type="button" aria-pressed={value === level}
        variant={value === level ? 'default' : 'outline'} onClick={() => onChange(level)}>{label}</Button>
    ))}
  </div>;
}