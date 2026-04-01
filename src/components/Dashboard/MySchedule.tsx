
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MyScheduleProps {
  onGoBack: () => void;
}

interface DayEntry {
  date: string;
  workout_quality?: 'excellent' | 'good' | 'poor' | 'none';
  diet_quality?: 'excellent' | 'good' | 'poor';
  mood?: 'excellent' | 'good' | 'neutral' | 'poor';
  notes?: string;
}

const MySchedule: React.FC<MyScheduleProps> = ({ onGoBack }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dayEntries, setDayEntries] = useState<Record<string, DayEntry>>({});
  const [currentEntry, setCurrentEntry] = useState<DayEntry>({
    date: new Date().toISOString().split('T')[0], workout_quality: undefined, diet_quality: undefined, mood: undefined, notes: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchDayEntries(); }, [user]);

  useEffect(() => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const existingEntry = dayEntries[dateKey];
    if (existingEntry) setCurrentEntry(existingEntry);
    else setCurrentEntry({ date: dateKey, workout_quality: undefined, diet_quality: undefined, mood: undefined, notes: '' });
  }, [selectedDate, dayEntries]);

  const fetchDayEntries = async () => {
    try {
      const { data, error } = await supabase.from('activity_logs').select('*').eq('user_id', user?.id).eq('activity_type', 'day_entry').order('created_at', { ascending: false });
      if (error) { console.error('Error fetching day entries:', error); return; }
      const entriesMap: Record<string, DayEntry> = {};
      data?.forEach(log => {
        if (log.metadata && typeof log.metadata === 'object' && !Array.isArray(log.metadata)) {
          const metadata = log.metadata as Record<string, any>;
          if (metadata.date) {
            entriesMap[metadata.date] = { date: metadata.date, workout_quality: metadata.workout_quality, diet_quality: metadata.diet_quality, mood: metadata.mood, notes: metadata.notes || '' };
          }
        }
      });
      setDayEntries(entriesMap);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const saveDayEntry = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from('activity_logs').upsert({
        user_id: user.id, activity_type: 'day_entry', description: `Entrada del día ${currentEntry.date}`,
        metadata: { date: currentEntry.date, workout_quality: currentEntry.workout_quality, diet_quality: currentEntry.diet_quality, mood: currentEntry.mood, notes: currentEntry.notes }
      }, { onConflict: 'user_id,metadata->date' });
      if (error) { toast({ title: "Error", description: "No se pudo guardar la entrada del día", variant: "destructive" }); return; }
      setDayEntries(prev => ({ ...prev, [currentEntry.date]: currentEntry }));
      toast({ title: "Guardado", description: "Entrada del día guardada correctamente" });
    } catch (error) { console.error('Error:', error); }
  };

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case 'excellent': return 'bg-[hsl(var(--accent-green))]/20 text-[hsl(var(--accent-green))] border-[hsl(var(--accent-green))]/30';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'poor': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'neutral': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'none': return 'bg-white/10 text-white/50 border-white/20';
      default: return 'bg-white/5 text-white/30 border-white/10';
    }
  };

  const getQualityText = (quality?: string) => {
    switch (quality) {
      case 'excellent': return 'Excelente'; case 'good': return 'Bueno'; case 'poor': return 'Malo';
      case 'neutral': return 'Neutral'; case 'none': return 'No entrené'; default: return '';
    }
  };

  const hasEntryForDate = (date: Date) => dayEntries[date.toISOString().split('T')[0]] !== undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(220,20%,8%)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[hsl(var(--accent-green))] mx-auto"></div>
          <p className="mt-4 text-white/50">Cargando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={onGoBack} variant="ghost" className="mb-4 text-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/10">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Mi Agenda</h1>
          <p className="text-white/50 mt-2">Registra tu progreso diario</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader><CardTitle className="text-white">Calendario</CardTitle></CardHeader>
            <CardContent>
              <Calendar
                mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)}
                modifiers={{ hasEntry: (date) => hasEntryForDate(date) }}
                modifiersStyles={{ hasEntry: { backgroundColor: 'hsl(142, 71%, 45%)', color: 'white', borderRadius: '50%' } }}
                className="rounded-md border border-white/10 bg-white/5 text-white [&_.rdp-day]:text-white [&_.rdp-head_cell]:text-white/50 [&_.rdp-caption]:text-white [&_.rdp-nav_button]:text-white/60 [&_.rdp-nav_button:hover]:bg-white/10"
              />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="text-sm md:text-base">
                  {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <Button onClick={saveDayEntry} size="sm" className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
                  <Save className="w-4 h-4 mr-2" />Guardar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block text-white/60">¿Cómo fue tu entrenamiento?</label>
                <Select value={currentEntry.workout_quality} onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, workout_quality: value as any }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                  <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
                    <SelectItem value="excellent">Excelente</SelectItem><SelectItem value="good">Bueno</SelectItem>
                    <SelectItem value="poor">Flojo</SelectItem><SelectItem value="none">No entrené</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white/60">¿Cómo fue tu alimentación?</label>
                <Select value={currentEntry.diet_quality} onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, diet_quality: value as any }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                  <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
                    <SelectItem value="excellent">Excelente</SelectItem><SelectItem value="good">Buena</SelectItem><SelectItem value="poor">Mala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white/60">¿Cómo te sentiste?</label>
                <Select value={currentEntry.mood} onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, mood: value as any }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                  <SelectContent className="bg-[hsl(220,20%,15%)] border-white/10">
                    <SelectItem value="excellent">Excelente</SelectItem><SelectItem value="good">Bien</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem><SelectItem value="poor">Mal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-white/60">Notas del día</label>
                <Textarea value={currentEntry.notes} onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Escribe cualquier observación sobre tu día..." rows={4}
                  className="bg-white/5 border-white/10 text-white focus:border-[hsl(var(--accent-green))]" />
              </div>
              {(currentEntry.workout_quality || currentEntry.diet_quality || currentEntry.mood) && (
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-medium mb-3 text-white/70">Resumen del día</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentEntry.workout_quality && <Badge className={`${getQualityColor(currentEntry.workout_quality)} border`}>Entrenamiento: {getQualityText(currentEntry.workout_quality)}</Badge>}
                    {currentEntry.diet_quality && <Badge className={`${getQualityColor(currentEntry.diet_quality)} border`}>Dieta: {getQualityText(currentEntry.diet_quality)}</Badge>}
                    {currentEntry.mood && <Badge className={`${getQualityColor(currentEntry.mood)} border`}>Ánimo: {getQualityText(currentEntry.mood)}</Badge>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MySchedule;
