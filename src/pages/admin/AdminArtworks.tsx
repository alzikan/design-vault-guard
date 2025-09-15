import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Trash2, Edit } from 'lucide-react';
import AdminNav from '@/components/admin-nav';

interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  artist_name: string;
  created_year: number;
  medium: string;
  dimensions: string;
  price: number;
  is_featured: boolean;
  is_available: boolean;
}

const AdminArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    artist_name: 'Ibrahim al Zikan',
    created_year: new Date().getFullYear(),
    medium: '',
    dimensions: '',
    price: 0,
    is_featured: false,
    is_available: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArtworks(data || []);
    } catch (error) {
      toast.error('Failed to fetch artworks');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `artworks/${fileName}`;

    const { error } = await supabase.storage
      .from('gallery-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const artworkData = {
        ...formData,
        image_url: imageUrl || undefined,
      };

      if (editingId) {
        const { error } = await supabase
          .from('artworks')
          .update(artworkData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Artwork updated successfully');
      } else {
        const { error } = await supabase
          .from('artworks')
          .insert([artworkData]);

        if (error) throw error;
        toast.success('Artwork created successfully');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        artist_name: 'Ibrahim al Zikan',
        created_year: new Date().getFullYear(),
        medium: '',
        dimensions: '',
        price: 0,
        is_featured: false,
        is_available: true,
      });
      setSelectedFile(null);
      setEditingId(null);
      fetchArtworks();
    } catch (error) {
      toast.error('Failed to save artwork');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setFormData({
      title: artwork.title,
      description: artwork.description || '',
      artist_name: artwork.artist_name || 'Ibrahim al Zikan',
      created_year: artwork.created_year || new Date().getFullYear(),
      medium: artwork.medium || '',
      dimensions: artwork.dimensions || '',
      price: artwork.price || 0,
      is_featured: artwork.is_featured,
      is_available: artwork.is_available,
    });
    setEditingId(artwork.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    try {
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Artwork deleted successfully');
      fetchArtworks();
    } catch (error) {
      toast.error('Failed to delete artwork');
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
              <CardTitle>{editingId ? 'Edit Artwork' : 'Add New Artwork'}</CardTitle>
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
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="created_year">Year Created</Label>
                    <Input
                      id="created_year"
                      type="number"
                      value={formData.created_year}
                      onChange={(e) => setFormData({ ...formData, created_year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medium">Medium</Label>
                    <Input
                      id="medium"
                      value={formData.medium}
                      onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
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
                      id="is_available"
                      checked={formData.is_available}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                    />
                    <Label htmlFor="is_available">Available</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Artwork' : 'Add Artwork'}
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
                        artist_name: 'Ibrahim al Zikan',
                        created_year: new Date().getFullYear(),
                        medium: '',
                        dimensions: '',
                        price: 0,
                        is_featured: false,
                        is_available: true,
                      });
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Artworks List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Artworks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {artworks.map((artwork) => (
                  <div key={artwork.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    {artwork.image_url && (
                      <img 
                        src={artwork.image_url} 
                        alt={artwork.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{artwork.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {artwork.created_year} • {artwork.medium}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        {artwork.is_featured && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        {artwork.is_available && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(artwork)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(artwork.id)}
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

export default AdminArtworks;