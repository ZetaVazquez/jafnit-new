import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminPendingPaymentsProps {
  onGoBack: () => void;
}

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
}

interface ActiveSub {
  user_id: string;
  plan_type: string | null;
  end_date: string | null;
  amount?: number | null;
  source: 'subscriptions' | 'stripe';
}

// Precios de referencia (memoria del proyecto)
const PLAN_PRICE: Record<string, number> = {
  basic: 49,
  monthly: 79,
  premium: 79,
  quarterly: 199,
  pro: 199,
};

const ADMIN_EMAILS = ['josefiguenu@gmail.com', 'consultajafn@gmail.com', 'zaiidav347@gmail.com'];

const daysBetween = (a: Date, b: Date) => Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));

const AdminPendingPayments: React.FC<AdminPendingPaymentsProps> = ({ onGoBack }) => {
  const [loading, setLoading] = useState(true);
  const [inactive, setInactive] = useState<Array<Profile & { amountDue: number; daysInactive: number }>>([]);
  const [expiring, setExpiring] = useState<Array<Profile & { planType: string; endDate: string; daysLeft: number; amount: number }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [profilesRes, subsRes, stripeRes] = await Promise.all([
        supabase.from('profiles').select('id, name, email, created_at'),
        supabase.from('subscriptions').select('user_id, plan_type, end_date, amount, status').eq('status', 'active'),
        supabase.from('stripe_subscriptions').select('user_id, plan_type, current_period_end, status'),
      ]);

      if (profilesRes.error) throw profilesRes.error;

      const now = new Date();
      const activeMap = new Map<string, ActiveSub>();

      (subsRes.data || []).forEach((s: any) => {
        const end = s.end_date ? new Date(s.end_date) : null;
        if (!end || end > now) {
          activeMap.set(s.user_id, {
            user_id: s.user_id,
            plan_type: s.plan_type,
            end_date: s.end_date,
            amount: s.amount,
            source: 'subscriptions',
          });
        }
      });

      (stripeRes.data || []).forEach((s: any) => {
        if (s.status !== 'active') return;
        const end = s.current_period_end ? new Date(s.current_period_end) : null;
        if (!end || end > now) {
          if (!activeMap.has(s.user_id)) {
            activeMap.set(s.user_id, {
              user_id: s.user_id,
              plan_type: s.plan_type,
              end_date: s.current_period_end,
              source: 'stripe',
            });
          }
        }
      });

      const profiles = (profilesRes.data || []).filter((p: any) => !ADMIN_EMAILS.includes(p.email || ''));

      const inactiveList: typeof inactive = [];
      const expiringList: typeof expiring = [];

      profiles.forEach((p: any) => {
        const sub = activeMap.get(p.id);
        if (!sub) {
          const daysInactive = daysBetween(new Date(p.created_at), now);
          inactiveList.push({
            ...p,
            amountDue: PLAN_PRICE.monthly,
            daysInactive,
          });
        } else if (sub.end_date) {
          const end = new Date(sub.end_date);
          const daysLeft = daysBetween(now, end);
          if (daysLeft <= 10 && daysLeft >= 0) {
            expiringList.push({
              ...p,
              planType: sub.plan_type || 'monthly',
              endDate: sub.end_date,
              daysLeft,
              amount: sub.amount || PLAN_PRICE[sub.plan_type || 'monthly'] || PLAN_PRICE.monthly,
            });
          }
        }
      });

      inactiveList.sort((a, b) => b.daysInactive - a.daysInactive);
      expiringList.sort((a, b) => a.daysLeft - b.daysLeft);

      setInactive(inactiveList);
      setExpiring(expiringList);
    } catch (err: any) {
      console.error('Error cargando pagos:', err);
      toast({ title: 'Error', description: err.message || 'No se pudo cargar la información.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = (email: string | null, name: string | null, daysLeft?: number) => {
    if (!email) {
      toast({ title: 'Sin email', description: 'Este usuario no tiene email registrado.', variant: 'destructive' });
      return;
    }
    const subject = encodeURIComponent(
      daysLeft !== undefined
        ? `Tu plan JAFN vence en ${daysLeft} día${daysLeft === 1 ? '' : 's'}`
        : 'Renueva tu plan JAFN y sigue avanzando'
    );
    const body = encodeURIComponent(
      `Hola ${name || ''},\n\n` +
        (daysLeft !== undefined
          ? `Te escribimos para recordarte que tu plan JAFN vence en ${daysLeft} día${daysLeft === 1 ? '' : 's'}. Renueva antes de que finalice para no perder el acceso a tus programas, seguimiento y comunidad.\n\n`
          : `Vimos que aún no has activado tu plan JAFN. Si necesitas ayuda para elegir el plan que mejor se adapta a tus objetivos, estamos aquí para asesorarte.\n\n`) +
        `Puedes gestionar tu suscripción desde el panel de cliente en nuestra web.\n\n` +
        `Un saludo,\nEquipo JAFN`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,20%,8%)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[hsl(var(--accent-green-light))] mx-auto"></div>
          <p className="mt-4 text-white/60">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="mr-4 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-white">
            Pagos <span className="text-[hsl(var(--accent-green-light))] italic">Pendientes</span>
          </h1>
        </div>

        {/* Usuarios inactivos */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-white gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Usuarios inactivos ({inactive.length})
            </CardTitle>
            <p className="text-white/50 text-sm">Registrados pero sin plan activo.</p>
          </CardHeader>
          <CardContent>
            {inactive.length === 0 ? (
              <div className="text-center py-6 text-white/50">No hay usuarios inactivos.</div>
            ) : (
              <Table className="text-white/80">
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Cliente</TableHead>
                    <TableHead>Debe pagar</TableHead>
                    <TableHead>Inactivo desde</TableHead>
                    <TableHead>Días inactivo</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inactive.map((u) => (
                    <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="font-medium text-white">{u.name || 'Sin nombre'}</div>
                        <div className="text-sm text-white/50">{u.email || 'Sin email'}</div>
                      </TableCell>
                      <TableCell className="font-medium text-[hsl(var(--accent-green-light))]">
                        <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" />€{u.amountDue}</div>
                        <div className="text-xs text-white/40">(plan mensual)</div>
                      </TableCell>
                      <TableCell>{new Date(u.created_at).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-red-400 border-red-500/30">
                          {u.daysInactive} días
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => sendReminder(u.email, u.name)}
                          className="bg-[hsl(var(--accent-green-light))]/20 text-[hsl(var(--accent-green-light))] hover:bg-[hsl(var(--accent-green-light))]/30 border border-[hsl(var(--accent-green-light))]/30"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar recordatorio
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Suscripciones próximas a vencer */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-white gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              Planes próximos a vencer ({expiring.length})
            </CardTitle>
            <p className="text-white/50 text-sm">Suscripciones activas que finalizan en 10 días o menos.</p>
          </CardHeader>
          <CardContent>
            {expiring.length === 0 ? (
              <div className="text-center py-6 text-white/50">No hay planes próximos a vencer.</div>
            ) : (
              <Table className="text-white/80">
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Cliente</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Vence el</TableHead>
                    <TableHead>Días restantes</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiring.map((u) => (
                    <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="font-medium text-white">{u.name || 'Sin nombre'}</div>
                        <div className="text-sm text-white/50">{u.email || 'Sin email'}</div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {u.planType} <span className="text-white/40">(€{u.amount})</span>
                      </TableCell>
                      <TableCell>{new Date(u.endDate).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            u.daysLeft <= 3
                              ? 'text-red-400 border-red-500/30'
                              : u.daysLeft <= 7
                              ? 'text-yellow-400 border-yellow-500/30'
                              : 'text-white/70 border-white/20'
                          }
                        >
                          {u.daysLeft} día{u.daysLeft === 1 ? '' : 's'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => sendReminder(u.email, u.name, u.daysLeft)}
                          className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/30"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Avisar vencimiento
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPendingPayments;
