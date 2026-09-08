import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getPlanById } from '@/config/plans';
import { openStripeCheckout } from '@/lib/checkout';
import TermsModal from './TermsModal';
import { Loader2, Lock } from 'lucide-react';

interface CheckoutRegisterModalProps {
  isOpen: boolean;
  planId: string | null;
  onClose: () => void;
}

const OBJETIVOS = [
  'Pérdida de grasa',
  'Ganancia muscular',
  'Recomposición corporal',
  'Rendimiento deportivo',
  'Mejorar salud y energía',
];

/**
 * Paso previo obligatorio al pago: recoge los datos del Paso 7 del cuestionario corto
 * (nombre, apellidos, edad, objetivo, email, teléfono), crea la cuenta (usuario NO activo)
 * y a continuación abre Stripe con el pago ya asociado a ese usuario.
 */
const CheckoutRegisterModal: React.FC<CheckoutRegisterModalProps> = ({ isOpen, planId, onClose }) => {
  const { user, signUp, signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    age: '',
    main_objective: '',
    email: '',
    phone: '',
    password: '',
  });

  const plan = planId ? getPlanById(planId) : undefined;

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const saveLeadData = async (userId: string) => {
    try {
      await (supabase as any).from('client_forms').insert([{
        user_id: userId,
        full_name: `${form.first_name} ${form.last_name}`.trim(),
        age: form.age ? Number(form.age) : null,
        main_objective: form.main_objective,
        email: form.email,
        phone: form.phone,
        contracted_program: plan?.name ?? null,
        payment_method: 'Stripe',
        start_date: new Date().toISOString().slice(0, 10),
      }]);
    } catch (e) {
      console.error('No se pudieron guardar los datos del cliente', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    // Si ya hay sesión, no repetimos el registro: directamente al pago.
    if (user) {
      await openStripeCheckout(plan.id, user);
      return;
    }


    if (!accepted) {
      toast({ title: 'Faltan los términos', description: 'Debes aceptar los términos y condiciones.', variant: 'destructive' });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: 'Contraseña muy corta', description: 'Usa al menos 6 caracteres.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const fullName = `${form.first_name} ${form.last_name}`.trim();
      const { error } = await signUp(form.email, form.password, fullName);

      if (error) {
        const already = /already registered|already been registered/i.test(error.message || '');
        if (already) {
          const { error: signInError } = await signIn(form.email, form.password);
          if (signInError) {
            toast({
              title: 'Este email ya tiene cuenta',
              description: 'Inicia sesión con tu contraseña para continuar con el pago.',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }
        } else {
          toast({ title: 'No se pudo crear la cuenta', description: error.message, variant: 'destructive' });
          setLoading(false);
          return;
        }
      }

      const { data: current } = await supabase.auth.getUser();
      const created = current.user;

      if (!created) {
        toast({
          title: 'Revisa tu correo',
          description: 'Tu cuenta se ha creado. Confírmala e inicia sesión para completar el pago.',
        });
        setLoading(false);
        onClose();
        return;
      }

      await saveLeadData(created.id);
      await supabase.from('terms_acceptances').insert({
        user_id: created.id,
        accepted_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        terms_version: '1.0',
      });

      toast({ title: 'Cuenta creada', description: 'Te llevamos al pago seguro de Stripe.' });
      await openStripeCheckout(plan.id, { id: created.id, email: created.email });

    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Ha ocurrido un error inesperado.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-lg bg-[hsl(220,20%,10%)] border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {plan ? `Contratar ${plan.name} · ${plan.priceLabel}` : 'Completa tu registro'}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Para pagar necesitamos asociar la compra a tu cuenta. Rellena tus datos y te llevamos al pago seguro.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-white/70">Nombre *</Label>
                    <Input required value={form.first_name} onChange={(e) => set('first_name', e.target.value)}
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70">Apellidos *</Label>
                    <Input required value={form.last_name} onChange={(e) => set('last_name', e.target.value)}
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70">Edad *</Label>
                    <Input required type="number" min={14} max={99} value={form.age}
                      onChange={(e) => set('age', e.target.value)}
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70">Objetivo *</Label>
                    <Select value={form.main_objective} onValueChange={(v) => set('main_objective', v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Elige tu objetivo" />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(220,20%,12%)] border-white/10 text-white z-[100]">
                        {OBJETIVOS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-white/70">Correo electrónico *</Label>
                  <Input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                    className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Teléfono / WhatsApp *</Label>
                  <Input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
                    className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Contraseña *</Label>
                  <Input required type="password" minLength={6} value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    className="bg-white/5 border-white/10 text-white" />
                  <p className="text-xs text-white/40">Con esta contraseña entrarás a tu panel de cliente.</p>
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                  <Checkbox id="checkout-terms" checked={accepted}
                    onCheckedChange={(c) => setAccepted(c as boolean)} className="mt-0.5" />
                  <label htmlFor="checkout-terms" className="text-sm text-white/70 cursor-pointer">
                    Acepto los{' '}
                    <button type="button" onClick={() => setShowTerms(true)}
                      className="text-[hsl(var(--accent-green-light))] underline">
                      Términos y Condiciones
                    </button>{' '}
                    y el cobro del programa seleccionado.
                  </label>
                </div>
              </>
            )}

            {user && (
              <p className="text-sm text-white/60">
                Vas a pagar con la cuenta <strong className="text-white">{user.email}</strong>.
              </p>
            )}

            <Button type="submit" disabled={loading} className="btn-cta w-full py-3">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
              {loading ? 'Creando tu cuenta...' : `Ir al pago seguro${plan ? ` · ${plan.priceLabel}` : ''}`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutRegisterModal;
