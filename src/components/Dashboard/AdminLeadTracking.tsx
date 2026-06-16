import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Phone, MessageCircle, User, Calendar, Target, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props { onGoBack: () => void; }

interface Lead {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  acquisition_source: string | null;
  contact_message: string | null;
  info_needed: string | null;
  preferred_contact_method: string | null;
  main_objective: string | null;
  created_at: string;
  has_subscription: boolean;
}

interface Followup {
  id: string;
  user_id: string;
  status: string;
  note: string | null;
  next_action: string | null;
  next_action_date: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  nuevo: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  contactado: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  en_negociacion: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  convertido: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  descartado: 'bg-red-500/20 text-red-300 border-red-500/40',
};

const STATUS_LABEL: Record<string, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  en_negociacion: 'En negociación',
  convertido: 'Convertido',
  descartado: 'Descartado',
};

const AdminLeadTracking: React.FC<Props> = ({ onGoBack }) => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'leads' | 'clients'>('leads');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [latestStatus, setLatestStatus] = useState<Record<string, string>>({});

  // New follow-up form
  const [newStatus, setNewStatus] = useState('nuevo');
  const [newNote, setNewNote] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newActionDate, setNewActionDate] = useState('');

  useEffect(() => { loadLeads(); }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const { data: forms, error } = await (supabase as any)
        .from('client_forms')
        .select('user_id, full_name, email, phone, acquisition_source, contact_message, info_needed, preferred_contact_method, main_objective, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;

      const userIds = (forms || []).map((f: any) => f.user_id);
      const { data: subs } = await (supabase as any)
        .from('subscriptions')
        .select('user_id, status')
        .in('user_id', userIds.length ? userIds : ['00000000-0000-0000-0000-000000000000']);
      const activeSet = new Set((subs || []).filter((s: any) => s.status === 'active').map((s: any) => s.user_id));

      const enriched: Lead[] = (forms || []).map((f: any) => ({ ...f, has_subscription: activeSet.has(f.user_id) }));
      setLeads(enriched);

      // Latest followup status per user
      const { data: fps } = await (supabase as any)
        .from('lead_followups')
        .select('user_id, status, created_at')
        .order('created_at', { ascending: false });
      const map: Record<string, string> = {};
      (fps || []).forEach((r: any) => { if (!map[r.user_id]) map[r.user_id] = r.status; });
      setLatestStatus(map);
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Error', description: 'No se pudieron cargar los leads', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const openLead = async (lead: Lead) => {
    setSelected(lead);
    setNewStatus(latestStatus[lead.user_id] || 'nuevo');
    setNewNote(''); setNewAction(''); setNewActionDate('');
    const { data } = await (supabase as any)
      .from('lead_followups')
      .select('*')
      .eq('user_id', lead.user_id)
      .order('created_at', { ascending: false });
    setFollowups(data || []);
  };

  const addFollowup = async () => {
    if (!selected) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await (supabase as any).from('lead_followups').insert([{
      user_id: selected.user_id,
      status: newStatus,
      note: newNote || null,
      next_action: newAction || null,
      next_action_date: newActionDate || null,
      created_by: user?.id,
    }]);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Seguimiento registrado' });
    setLatestStatus(prev => ({ ...prev, [selected.user_id]: newStatus }));
    setNewNote(''); setNewAction(''); setNewActionDate('');
    openLead(selected);
  };

  const filtered = leads.filter(l => {
    if (filter === 'leads' && l.has_subscription) return false;
    if (filter === 'clients' && !l.has_subscription) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (l.full_name || '').toLowerCase().includes(q)
      || (l.email || '').toLowerCase().includes(q)
      || (l.phone || '').toLowerCase().includes(q);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button onClick={onGoBack} variant="ghost" className="text-white/70 hover:text-white mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Seguimiento de <span className="text-[hsl(var(--accent-green-light))] italic">Leads</span>
          </h1>
          <p className="text-white/50 mt-1">Gestiona contactos y potenciales clientes</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, email o teléfono..." className="pl-9 bg-white/5 border-white/10 text-white" />
        </div>
        {(['leads', 'clients', 'all'] as const).map(f => (
          <Button key={f} onClick={() => setFilter(f)}
            className={filter === f
              ? 'bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)] text-white border border-[hsl(142,71%,45%)]'
              : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10'}>
            {f === 'leads' ? 'Sin suscripción' : f === 'clients' ? 'Suscritos' : 'Todos'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-white/60">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-white/60 text-center py-12">No hay registros que mostrar.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(lead => {
            const status = latestStatus[lead.user_id] || 'nuevo';
            return (
              <div key={lead.user_id} onClick={() => openLead(lead)}
                className="cursor-pointer rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-sm p-5 transition-all hover:scale-[1.02] hover:border-[hsl(142,71%,45%)]/40">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(142,71%,45%)]/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-[hsl(var(--accent-green-light))]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{lead.full_name || 'Sin nombre'}</h3>
                      <p className="text-xs text-white/50">{new Date(lead.created_at).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={STATUS_COLORS[status]}>{STATUS_LABEL[status]}</Badge>
                </div>
                <div className="space-y-1.5 text-sm">
                  {lead.email && <div className="flex items-center gap-2 text-white/70"><Mail className="w-3.5 h-3.5" />{lead.email}</div>}
                  {lead.phone && <div className="flex items-center gap-2 text-white/70"><Phone className="w-3.5 h-3.5" />{lead.phone}</div>}
                  {lead.acquisition_source && <div className="flex items-center gap-2 text-white/70"><Target className="w-3.5 h-3.5" />Conoció por: {lead.acquisition_source}</div>}
                  {lead.contact_message && <div className="mt-2 p-2 rounded bg-white/5 text-white/80 italic text-xs line-clamp-2">"{lead.contact_message}"</div>}
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {lead.has_subscription && <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Suscrito</Badge>}
                  {lead.preferred_contact_method && <Badge variant="outline" className="border-white/10 text-white/60">Prefiere {lead.preferred_contact_method}</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[hsl(220,20%,10%)] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{selected?.full_name || 'Lead'}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                {selected.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[hsl(var(--accent-green-light))]" />{selected.email}</div>}
                {selected.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[hsl(var(--accent-green-light))]" />{selected.phone}</div>}
                {selected.acquisition_source && <div className="flex items-center gap-2"><Target className="w-4 h-4 text-[hsl(var(--accent-green-light))]" />Captación: {selected.acquisition_source}</div>}
                {selected.preferred_contact_method && <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[hsl(var(--accent-green-light))]" />Prefiere: {selected.preferred_contact_method}</div>}
                {selected.main_objective && <div className="flex items-center gap-2 md:col-span-2"><Target className="w-4 h-4 text-[hsl(var(--accent-green-light))]" />Objetivo: {selected.main_objective}</div>}
              </div>

              {(selected.info_needed || selected.contact_message) && (
                <div className="space-y-3">
                  {selected.info_needed && (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-white/50 mb-1">Qué necesita para empezar</div>
                      <p className="text-sm text-white/90 whitespace-pre-wrap">{selected.info_needed}</p>
                    </div>
                  )}
                  {selected.contact_message && (
                    <div className="p-3 rounded-lg bg-[hsl(142,71%,45%)]/10 border border-[hsl(142,71%,45%)]/30">
                      <div className="text-xs text-white/50 mb-1">Primer mensaje</div>
                      <p className="text-sm text-white/90 whitespace-pre-wrap">{selected.contact_message}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-white/10 pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Añadir seguimiento</h4>
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/60">Estado</label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-white/60">Fecha próxima acción</label>
                      <Input type="date" value={newActionDate} onChange={e => setNewActionDate(e.target.value)} className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/60">Próxima acción</label>
                    <Input value={newAction} onChange={e => setNewAction(e.target.value)} placeholder="Ej: llamar el martes, enviar propuesta..." className="bg-white/5 border-white/10" />
                  </div>
                  <div>
                    <label className="text-xs text-white/60">Nota</label>
                    <Textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Resumen de la conversación, dudas, objeciones..." className="bg-white/5 border-white/10" />
                  </div>
                  <Button onClick={addFollowup} className="bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)] text-white">Guardar seguimiento</Button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="font-semibold mb-3">Historial</h4>
                {followups.length === 0 ? (
                  <p className="text-sm text-white/50">Sin seguimientos todavía.</p>
                ) : (
                  <div className="space-y-2">
                    {followups.map(f => (
                      <div key={f.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className={STATUS_COLORS[f.status]}>{STATUS_LABEL[f.status] || f.status}</Badge>
                          <span className="text-xs text-white/40 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(f.created_at).toLocaleString('es-ES')}</span>
                        </div>
                        {f.note && <p className="text-sm text-white/80 whitespace-pre-wrap">{f.note}</p>}
                        {f.next_action && <p className="text-xs text-white/60 mt-1">Próxima: {f.next_action}{f.next_action_date ? ` (${new Date(f.next_action_date).toLocaleDateString('es-ES')})` : ''}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeadTracking;