import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import AdminNav from '@/components/admin-nav';
import { useLanguage } from '@/contexts/LanguageContext';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail_url: string;
  video_url: string;
  duration_minutes: number;
  difficulty_level: string;
  category: string;
  is_published: boolean;
  order_index: number;
}

const AdminLessons = () => {
  const { t } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    duration_minutes: 0,
    difficulty_level: 'beginner',
    category: '',
    is_published: false,
    order_index: 0,
  });
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      toast.error('Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  const uploadThumbnail = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `lessons/${fileName}`;

    const { error } = await supabase.storage
      .from('lesson-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('lesson-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let thumbnailUrl = '';
      
      if (selectedThumbnail) {
        thumbnailUrl = await uploadThumbnail(selectedThumbnail);
      }

      const lessonData = {
        ...formData,
        thumbnail_url: thumbnailUrl || undefined,
      };

      if (editingId) {
        const { error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Lesson updated successfully');
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert([lessonData]);

        if (error) throw error;
        toast.success('Lesson created successfully');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        video_url: '',
        duration_minutes: 0,
        difficulty_level: 'beginner',
        category: '',
        is_published: false,
        order_index: 0,
      });
      setSelectedThumbnail(null);
      setEditingId(null);
      fetchLessons();
    } catch (error) {
      toast.error('Failed to save lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setFormData({
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      video_url: lesson.video_url || '',
      duration_minutes: lesson.duration_minutes || 0,
      difficulty_level: lesson.difficulty_level || 'beginner',
      category: lesson.category || '',
      is_published: lesson.is_published,
      order_index: lesson.order_index || 0,
    });
    setEditingId(lesson.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.deleteLessonConfirm'))) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Lesson deleted successfully');
      fetchLessons();
    } catch (error) {
      toast.error('Failed to delete lesson');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? t('admin.editLesson') : t('admin.addNewLesson')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('admin.title_field')}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t('admin.description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="content">{t('admin.content')}</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="video_url">{t('admin.videoUrl')}</Label>
                  <Input
                    id="video_url"
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnail">{t('admin.thumbnail')}</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">{t('admin.duration')}</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="order">{t('admin.orderIndex')}</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">{t('admin.difficulty')}</Label>
                    <Select
                      value={formData.difficulty_level}
                      onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.selectDifficulty')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">{t('lessons.beginner')}</SelectItem>
                        <SelectItem value="intermediate">{t('lessons.intermediate')}</SelectItem>
                        <SelectItem value="advanced">{t('lessons.advanced')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">{t('admin.category')}</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">{t('admin.published')}</Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('admin.saving') : editingId ? t('admin.updateLesson') : t('admin.addLesson')}
                </Button>

                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        title: '',
                        description: '',
                        content: '',
                        video_url: '',
                        duration_minutes: 0,
                        difficulty_level: 'beginner',
                        category: '',
                        is_published: false,
                        order_index: 0,
                      });
                    }}
                  >
                    {t('admin.cancelEdit')}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.existingLessons')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    {lesson.thumbnail_url && (
                      <img 
                        src={lesson.thumbnail_url} 
                        alt={lesson.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {lesson.difficulty_level} • {lesson.duration_minutes}min
                      </p>
                      <div className="flex space-x-2 mt-2">
                        {lesson.is_published && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {t('admin.published')}
                          </span>
                        )}
                        {lesson.category && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {lesson.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(lesson)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLessons;