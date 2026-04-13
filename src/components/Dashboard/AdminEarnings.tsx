
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Earning { id: string; amount: number; description: string; earning_date: string; created_at: string; }
interface AdminEarningsProps { onGoBack: () => void; }

const AdminEarnings: React.FC<AdminEarningsProps> = ({ onGoBack }) => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', description: '', earning_date: new Date().toISOString().split('T')[0] });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => { if (user) fetchEarnings(); }, [user]);

  const fetchEarnings = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('admin_earnings').select('*').eq('admin_id', user.id).order('earning_date', { ascending: false });
      if (error) throw error;
      setEarnings(data || []);
    } catch (error) { console.error('Error fetching earnings:', error); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !user) { toast({ title: "Error", description: "Completa la cantidad.", variant: "destructive" }); return; }
    try {
      const { error } = await supabase.from('admin_earnings').insert([{ admin_id: user.id, amount: parseFloat(formData.amount), description: formData.description, earning_date: formData.earning_date }]);
      if (error) throw error;
      toast({ title: "Ganancia agregada" });
      setFormData({ amount: '', description: '', earning_date: new Date().toISOString().split('T')[0] });
      setShowAddForm(false); fetchEarnings();
    } catch (error) { toast({ title: "Error", description: "No se pudo registrar.", variant: "destructive" }); }
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyEarnings = earnings.filter(e => { const d = new Date(e.earning_date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; });
  const yearlyEarnings = earnings.filter(e => new Date(e.earning_date).getFullYear() === currentYear);
  const monthlyTotal = monthlyEarnings.reduce((s, e) => s + e.amount, 0);
  const yearlyTotal = yearlyEarnings.reduce((s, e) => s + e.amount, 0);

  const getMonthlyBreakdown = () => {
    const breakdown: Record<string, number> = {};
    for (let m = 0; m < 12; m++) breakdown[new Date(currentYear, m).toLocaleString('es', { month: 'long' })] = 0;
    yearlyEarnings.forEach(e => { const mn = new Date(e.earning_date).toLocaleString('es', { month: 'long' }); breakdown[mn] += e.amount; });
    return breakdown;
  };

  const renderEarningsList = (list: Earning[]) => (
    list.length > 0 ? list.map(e => (
      <div key={e.id} className="flex justify-between items-center p-4 border border-white/10 rounded-lg bg-white/5">
        <div>
          <p className="font-medium text-white">€{e.amount.toFixed(2)}</p>
          {e.description && <p className="text-sm text-white/50">{e.description}</p>}
          <p className="text-xs text-white/30">{new Date(e.earning_date).toLocaleDateString()}</p>
        </div>
        <DollarSign className="w-5 h-5 text-[hsl(var(--accent-green))]" />
      </div>
    )) : <div className="text-center py-8 text-white/40">No hay ganancias registradas.</div>
  );

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" onClick={onGoBack} className="mr-4 border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />Volver
            </Button>
            <h1 className="text-3xl font-bold text-[hsl(var(--accent-green))]">Ganancias</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
            <Plus className="w-4 h-4 mr-2" />Agregar Ganancia
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-[hsl(var(--accent-green))]/20 bg-[hsl(var(--accent-green))]/10 backdrop-blur-sm">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div><p className="text-white/60 text-sm">Ganancias Este Mes</p><p className="text-3xl font-bold text-[hsl(var(--accent-green))]">€{monthlyTotal.toFixed(2)}</p></div>
                <Calendar className="w-8 h-8 text-[hsl(var(--accent-green))]/60" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-blue-500/10 backdrop-blur-sm">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div><p className="text-white/60 text-sm">Ganancias Este Año</p><p className="text-3xl font-bold text-blue-400">€{yearlyTotal.toFixed(2)}</p></div>
                <TrendingUp className="w-8 h-8 text-blue-400/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {showAddForm && (
          <Card className="mb-6 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader><CardTitle className="text-white">Agregar Nueva Ganancia</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Cantidad (€)</label>
                    <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" required className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Fecha</label>
                    <Input type="date" value={formData.earning_date} onChange={(e) => setFormData({ ...formData, earning_date: e.target.value })} required className="bg-white/5 border-white/10 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">Descripción</label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Descripción..." rows={3} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">Agregar</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
            <TabsTrigger value="monthly" className="data-[state=active]:bg-[hsl(var(--accent-green))]/20 data-[state=active]:text-[hsl(var(--accent-green))] text-white/50">Este Mes</TabsTrigger>
            <TabsTrigger value="yearly" className="data-[state=active]:bg-[hsl(var(--accent-green))]/20 data-[state=active]:text-[hsl(var(--accent-green))] text-white/50">Este Año</TabsTrigger>
            <TabsTrigger value="breakdown" className="data-[state=active]:bg-[hsl(var(--accent-green))]/20 data-[state=active]:text-[hsl(var(--accent-green))] text-white/50">Desglose</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-white">Ganancias de {new Date().toLocaleString('es', { month: 'long', year: 'numeric' })}</CardTitle></CardHeader>
              <CardContent><div className="space-y-4">{renderEarningsList(monthlyEarnings)}</div></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="yearly">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-white">Ganancias de {currentYear}</CardTitle></CardHeader>
              <CardContent><div className="space-y-4">{renderEarningsList(yearlyEarnings)}</div></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="breakdown">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-white">Desglose Mensual {currentYear}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(getMonthlyBreakdown()).map(([month, amount]) => (
                    <div key={month} className="p-4 border border-white/10 rounded-lg text-center bg-white/5">
                      <h3 className="font-medium capitalize text-white/70">{month}</h3>
                      <p className="text-2xl font-bold text-[hsl(var(--accent-green))]">€{amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminEarnings;
