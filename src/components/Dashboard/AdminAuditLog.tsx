import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Shield, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuditRow {
  id: string;
  actor_user_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  target_user_id: string | null;
  details: any;
  created_at: string;
}

const ENTITY_LABELS: Record<string, string> = {
  user_roles: 'Roles de usuario',
  diet_plans: 'Planes de dieta',
  workout_plans: 'Planes de entrenamiento',
  subscriptions: 'Suscripciones',
  stripe_subscriptions: 'Suscripciones Stripe',
  pending_payments: 'Pagos pendientes',
};

const ACTION_STYLE: Record<string, string> = {
  INSERT: 'text-emerald-400 border-emerald-500/30',
  UPDATE: 'text-yellow-400 border-yellow-500/30',
  DELETE: 'text-red-400 border-red-500/30',
};

const AdminAuditLog: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [entity, setEntity] = useState<string>('all');
  const [action, setAction] = useState<string>('all');
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from('admin_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (entity !== 'all' && r.entity_type !== entity) return false;
      if (action !== 'all' && r.action !== action) return false;
      if (q) {
        const hay = `${r.actor_email || ''} ${r.entity_id || ''} ${r.target_user_id || ''}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, entity, action, q]);

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onGoBack} className="mr-4 text-white/70 hover:text-white hover:bg-white/10 border border-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-7 h-7 text-[hsl(var(--accent-green-light))]" />
              Auditoría <span className="text-[hsl(var(--accent-green-light))] italic">Administrativa</span>
            </h1>
          </div>
          <Button onClick={load} variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 border border-white/10">
            <RefreshCw className="w-4 h-4 mr-2" /> Actualizar
          </Button>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">Registro de acciones ({filtered.length})</CardTitle>
            <div className="grid md:grid-cols-3 gap-3 mt-4">
              <Input
                placeholder="Buscar por email, ID..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Select value={entity} onValueChange={setEntity}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent className="bg-[hsl(220,20%,10%)] border-white/10 text-white">
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {Object.entries(ENTITY_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Acción" /></SelectTrigger>
                <SelectContent className="bg-[hsl(220,20%,10%)] border-white/10 text-white">
                  <SelectItem value="all">Todas las acciones</SelectItem>
                  <SelectItem value="INSERT">Creación</SelectItem>
                  <SelectItem value="UPDATE">Actualización</SelectItem>
                  <SelectItem value="DELETE">Eliminación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-white/50">Cargando registros...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 text-white/50">No hay registros que coincidan.</div>
            ) : (
              <Table className="text-white/80">
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Fecha</TableHead>
                    <TableHead>Administrador</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Entidad</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead className="text-right">Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <React.Fragment key={r.id}>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-sm">{new Date(r.created_at).toLocaleString('es-ES')}</TableCell>
                        <TableCell className="text-sm">{r.actor_email || <span className="text-white/40">sistema</span>}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={ACTION_STYLE[r.action] || 'text-white/70 border-white/20'}>
                            {r.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{ENTITY_LABELS[r.entity_type] || r.entity_type}</TableCell>
                        <TableCell className="text-xs font-mono text-white/60">
                          {r.target_user_id ? r.target_user_id.slice(0, 8) + '…' : r.entity_id ? r.entity_id.slice(0, 8) + '…' : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="text-white/60 hover:text-white h-7">
                            {expanded === r.id ? 'Ocultar' : 'Ver'}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expanded === r.id && (
                        <TableRow className="border-white/10 bg-black/30">
                          <TableCell colSpan={6}>
                            <pre className="text-[11px] text-white/70 overflow-x-auto whitespace-pre-wrap max-h-64">
{JSON.stringify(r.details, null, 2)}
                            </pre>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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

export default AdminAuditLog;