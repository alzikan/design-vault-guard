import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import AdminNav from '@/components/admin-nav';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration_minutes: number;
  category: string;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
}

const AdminVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0,
    category: '',
    is_featured: false,
    is_published: true,
  });
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const uploadThumbnail = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { error } = await supabase.storage
      .from('video-thumbnails')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('video-thumbnails')
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

      const videoData = {
        ...formData,
        thumbnail_url: thumbnailUrl || undefined,
      };

      if (editingId) {
        const { error } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Video updated successfully');
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([videoData]);

        if (error) throw error;
        toast.success('Video created successfully');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        video_url: '',
        duration_minutes: 0,
        category: '',
        is_featured: false,
        is_published: true,
      });
      setSelectedThumbnail(null);
      setEditingId(null);
      fetchVideos();
    } catch (error) {
      toast.error('Failed to save video');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    setFormData({
      title: video.title,
      description: video.description || '',
      video_url: video.video_url,
      duration_minutes: video.duration_minutes || 0,
      category: video.category || '',
      is_featured: video.is_featured,
      is_published: video.is_published,
    });
    setEditingId(video.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to delete video');
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
              <CardTitle>{editingId ? 'Edit Video' : 'Add New Video'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnail">Thumbnail Image</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                    />
                    <Label htmlFor="is_published">Published</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Video' : 'Add Video'}
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
                        video_url: '',
                        duration_minutes: 0,
                        category: '',
                        is_featured: false,
                        is_published: true,
                      });
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Videos List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    {video.thumbnail_url && (
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {video.duration_minutes}min • {video.view_count} views
                      </p>
                      <div className="flex space-x-2 mt-2">
                        {video.is_featured && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        {video.is_published && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Published
                          </span>
                        )}
                        {video.category && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {video.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(video)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(video.id)}
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

export default AdminVideos;