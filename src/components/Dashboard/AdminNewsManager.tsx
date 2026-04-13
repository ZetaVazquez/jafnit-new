
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2, Upload, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminNewsManagerProps { onGoBack: () => void; }
interface NewsItem { id: string; title: string; content: string; image_url?: string; created_at: string; published: boolean; }

const AdminNewsManager: React.FC<AdminNewsManagerProps> = ({ onGoBack }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', content: '', published: true });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase.from('admin_news').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setNews(data || []);
    } catch (error) { console.error('Error fetching news:', error); toast({ title: "Error", description: "Error al cargar las noticias", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('news-images').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('news-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setUploading(true);
      let imageUrl = editingNews?.image_url || null;
      if (imageFile) { imageUrl = await uploadImage(imageFile); }
      const newsData = { title: formData.title, content: formData.content, image_url: imageUrl, published: formData.published, created_by: user.id };
      if (editingNews) {
        const { error } = await supabase.from('admin_news').update(newsData).eq('id', editingNews.id);
        if (error) throw error;
        toast({ title: "Éxito", description: "Noticia actualizada correctamente" });
      } else {
        const { error } = await supabase.from('admin_news').insert([newsData]);
        if (error) throw error;
        toast({ title: "Éxito", description: "Noticia creada correctamente" });
      }
      resetForm(); fetchNews();
    } catch (error) { console.error('Error saving news:', error); toast({ title: "Error", description: "Error al guardar la noticia", variant: "destructive" }); }
    finally { setUploading(false); }
  };

  const handleEdit = (newsItem: NewsItem) => { setEditingNews(newsItem); setFormData({ title: newsItem.title, content: newsItem.content, published: newsItem.published }); setIsCreating(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) return;
    try {
      const { error } = await supabase.from('admin_news').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Éxito", description: "Noticia eliminada correctamente" }); fetchNews();
    } catch (error) { console.error('Error deleting news:', error); toast({ title: "Error", description: "Error al eliminar la noticia", variant: "destructive" }); }
  };

  const resetForm = () => { setFormData({ title: '', content: '', published: true }); setImageFile(null); setIsCreating(false); setEditingNews(null); };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--accent-green))]"></div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" onClick={resetForm} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver
          </Button>
          <h1 className="text-2xl font-bold text-[hsl(var(--accent-green))]">{editingNews ? 'Editar Noticia' : 'Crear Nueva Noticia'}</h1>
        </div>
        <Card className="max-w-2xl border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-white/70">Título</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="Ingresa el título" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[hsl(var(--accent-green))]" />
              </div>
              <div>
                <Label htmlFor="content" className="text-white/70">Contenido</Label>
                <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required placeholder="Escribe el contenido" rows={6} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[hsl(var(--accent-green))]" />
              </div>
              <div>
                <Label htmlFor="image" className="text-white/70">Imagen</Label>
                <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="cursor-pointer bg-white/5 border-white/10 text-white/70" />
                {editingNews?.image_url && !imageFile && (
                  <div className="mt-2">
                    <img src={editingNews.image_url} alt="Imagen actual" className="w-32 h-32 object-cover rounded-lg border border-white/10" />
                    <p className="text-sm text-white/40 mt-1">Imagen actual</p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="accent-[hsl(var(--accent-green))]" />
                <Label htmlFor="published" className="text-white/70">Publicar inmediatamente</Label>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" disabled={uploading} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
                  {uploading ? <><Upload className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : <><Plus className="w-4 h-4 mr-2" />{editingNews ? 'Actualizar' : 'Crear'}</>}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onGoBack} className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver
          </Button>
          <h1 className="text-2xl font-bold text-[hsl(var(--accent-green))]">Gestión de Noticias</h1>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
          <Plus className="w-4 h-4 mr-2" />Nueva Noticia
        </Button>
      </div>

      <div className="grid gap-6">
        {news.length === 0 ? (
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <p className="text-white/50">No hay noticias creadas aún.</p>
              <Button onClick={() => setIsCreating(true)} className="mt-4 bg-[hsl(var(--accent-green))] hover:bg-[hsl(var(--accent-green))]/80 text-white">
                <Plus className="w-4 h-4 mr-2" />Crear Primera Noticia
              </Button>
            </CardContent>
          </Card>
        ) : (
          news.map((newsItem) => (
            <Card key={newsItem.id} className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      {newsItem.image_url && <img src={newsItem.image_url} alt={newsItem.title} className="w-24 h-24 object-cover rounded-lg border border-white/10" />}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{newsItem.title}</h3>
                        <div className="flex items-center text-sm text-white/40 mb-2">
                          <Calendar className="w-4 h-4 mr-2" />{new Date(newsItem.created_at).toLocaleDateString('es-ES')}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${newsItem.published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'}`}>
                          {newsItem.published ? 'Publicada' : 'Borrador'}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/60 line-clamp-3">{newsItem.content}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(newsItem)} className="text-white/40 hover:text-white hover:bg-white/10"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(newsItem.id)} className="text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNewsManager;
