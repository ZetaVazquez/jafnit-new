
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

interface Earning {
  id: string;
  amount: number;
  description: string;
  earning_date: string;
  created_at: string;
}

interface AdminEarningsProps {
  onGoBack: () => void;
}

const AdminEarnings: React.FC<AdminEarningsProps> = ({ onGoBack }) => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    earning_date: new Date().toISOString().split('T')[0]
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEarnings();
    }
  }, [user]);

  const fetchEarnings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('admin_earnings')
        .select('*')
        .eq('admin_id', user.id)
        .order('earning_date', { ascending: false });

      if (error) throw error;
      setEarnings(data || []);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !user) {
      toast({
        title: "Error",
        description: "Completa la cantidad.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_earnings')
        .insert([{
          admin_id: user.id,
          amount: parseFloat(formData.amount),
          description: formData.description,
          earning_date: formData.earning_date
        }]);

      if (error) throw error;

      toast({
        title: "Ganancia agregada",
        description: "La ganancia ha sido registrada exitosamente.",
      });

      setFormData({ amount: '', description: '', earning_date: new Date().toISOString().split('T')[0] });
      setShowAddForm(false);
      fetchEarnings();
    } catch (error) {
      console.error('Error adding earning:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar la ganancia.",
        variant: "destructive",
      });
    }
  };

  const getMonthlyEarnings = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return earnings.filter(earning => {
      const earningDate = new Date(earning.earning_date);
      return earningDate.getMonth() === currentMonth && earningDate.getFullYear() === currentYear;
    });
  };

  const getYearlyEarnings = () => {
    const currentYear = new Date().getFullYear();
    
    return earnings.filter(earning => {
      const earningDate = new Date(earning.earning_date);
      return earningDate.getFullYear() === currentYear;
    });
  };

  const calculateTotal = (earningsList: Earning[]) => {
    return earningsList.reduce((total, earning) => total + earning.amount, 0);
  };

  const monthlyEarnings = getMonthlyEarnings();
  const yearlyEarnings = getYearlyEarnings();
  const monthlyTotal = calculateTotal(monthlyEarnings);
  const yearlyTotal = calculateTotal(yearlyEarnings);

  const getMonthlyBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    const currentYear = new Date().getFullYear();
    
    for (let month = 0; month < 12; month++) {
      const monthName = new Date(currentYear, month).toLocaleString('es', { month: 'long' });
      breakdown[monthName] = 0;
    }
    
    yearlyEarnings.forEach(earning => {
      const earningDate = new Date(earning.earning_date);
      const monthName = earningDate.toLocaleString('es', { month: 'long' });
      breakdown[monthName] += earning.amount;
    });
    
    return breakdown;
  };

  const monthlyBreakdown = getMonthlyBreakdown();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onGoBack} className="mr-4 text-white/70 hover:text-white hover:bg-white/10 border border-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold text-white">Ganancias <span className="text-[hsl(var(--accent-green-light))] italic">Mensuales</span></h1>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="btn-cta"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Ganancia
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[hsl(var(--accent-green-light))]/20 to-[hsl(var(--accent-green-light))]/5 border-[hsl(var(--accent-green-light))]/30 text-white backdrop-blur-sm">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Ganancias Este Mes</p>
                  <p className="text-3xl font-bold">€{monthlyTotal.toFixed(2)}</p>
                </div>
                <Calendar className="w-8 h-8 text-[hsl(var(--accent-green-light))]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white backdrop-blur-sm">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Ganancias Este Año</p>
                  <p className="text-3xl font-bold">€{yearlyTotal.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[hsl(var(--accent-green-light))]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Earning Form */}
        {showAddForm && (
          <Card className="mb-6 bg-white/5 border-white/10 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle className="text-white">Agregar Nueva Ganancia</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Cantidad (€)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Fecha</label>
                    <Input
                      type="date"
                      value={formData.earning_date}
                      onChange={(e) => setFormData({ ...formData, earning_date: e.target.value })}
                      required
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Descripción</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción de la ganancia..."
                    rows={3}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    type="submit"
                    className="btn-cta"
                  >
                    Agregar Ganancia
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowAddForm(false);
                      setFormData({ amount: '', description: '', earning_date: new Date().toISOString().split('T')[0] });
                    }}
                    className="text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Earnings Tabs */}
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
            <TabsTrigger value="monthly">Este Mes</TabsTrigger>
            <TabsTrigger value="yearly">Este Año</TabsTrigger>
            <TabsTrigger value="breakdown">Desglose Mensual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
              <CardHeader>
                <CardTitle className="text-white">Ganancias de {new Date().toLocaleString('es', { month: 'long', year: 'numeric' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyEarnings.length > 0 ? (
                    monthlyEarnings.map((earning) => (
                      <div key={earning.id} className="flex justify-between items-center p-4 border border-white/10 rounded-lg bg-white/5">
                        <div>
                          <p className="font-medium text-[hsl(var(--accent-green-light))]">€{earning.amount.toFixed(2)}</p>
                          {earning.description && (
                            <p className="text-sm text-white/70">{earning.description}</p>
                          )}
                          <p className="text-xs text-white/40">
                            {new Date(earning.earning_date).toLocaleDateString()}
                          </p>
                        </div>
                        <DollarSign className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white/50">
                      No hay ganancias registradas este mes.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="yearly">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
              <CardHeader>
                <CardTitle className="text-white">Ganancias de {new Date().getFullYear()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {yearlyEarnings.length > 0 ? (
                    yearlyEarnings.map((earning) => (
                      <div key={earning.id} className="flex justify-between items-center p-4 border border-white/10 rounded-lg bg-white/5">
                        <div>
                          <p className="font-medium text-[hsl(var(--accent-green-light))]">€{earning.amount.toFixed(2)}</p>
                          {earning.description && (
                            <p className="text-sm text-white/70">{earning.description}</p>
                          )}
                          <p className="text-xs text-white/40">
                            {new Date(earning.earning_date).toLocaleDateString()}
                          </p>
                        </div>
                        <DollarSign className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white/50">
                      No hay ganancias registradas este año.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="breakdown">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
              <CardHeader>
                <CardTitle className="text-white">Desglose Mensual {new Date().getFullYear()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(monthlyBreakdown).map(([month, amount]) => (
                    <div key={month} className="p-4 border border-white/10 rounded-lg text-center bg-white/5">
                      <h3 className="font-medium capitalize text-white/80">{month}</h3>
                      <p className="text-2xl font-bold text-[hsl(var(--accent-green-light))]">€{amount.toFixed(2)}</p>
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
