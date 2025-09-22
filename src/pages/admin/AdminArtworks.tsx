import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Trash2, Edit, Plus, Tag } from 'lucide-react';
import AdminNav from '@/components/admin-nav';
import { useLanguage } from '@/contexts/LanguageContext';

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
  category: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const AdminArtworks = () => {
  const { t } = useLanguage();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
    category: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Category management state
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  useEffect(() => {
    fetchArtworks();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('artwork_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
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
        category: '',
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
      category: artwork.category || '',
    });
    setEditingId(artwork.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return;

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

  // Category management functions
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategoryId) {
        const { error } = await supabase
          .from('artwork_categories')
          .update(categoryFormData)
          .eq('id', editingCategoryId);

        if (error) throw error;
        toast.success('Category updated successfully');
      } else {
        const { error } = await supabase
          .from('artwork_categories')
          .insert([categoryFormData]);

        if (error) throw error;
        toast.success('Category created successfully');
      }

      setCategoryFormData({ name: '', description: '' });
      setEditingCategoryId(null);
      setShowCategoryDialog(false);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
    });
    setEditingCategoryId(category.id);
    setShowCategoryDialog(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('artwork_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Management Section */}
        <div className="mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Category Management
              </CardTitle>
              <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setCategoryFormData({ name: '', description: '' });
                    setEditingCategoryId(null);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Textarea
                        id="categoryDescription"
                        value={categoryFormData.description}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : editingCategoryId ? 'Update' : 'Create'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCategoryDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{category.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-2">{category.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? t('admin.editArtwork') : t('admin.addNewArtwork')}</CardTitle>
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
                  <Label htmlFor="image">{t('admin.image')}</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="created_year">{t('admin.yearCreated')}</Label>
                    <Input
                      id="created_year"
                      type="number"
                      value={formData.created_year}
                      onChange={(e) => setFormData({ ...formData, created_year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">{t('admin.price')}</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medium">{t('admin.medium')}</Label>
                    <Input
                      id="medium"
                      value={formData.medium}
                      onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimensions">{t('admin.dimensions')}</Label>
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
                    <Label htmlFor="is_featured">{t('admin.featured')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_available"
                      checked={formData.is_available}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                    />
                    <Label htmlFor="is_available">{t('admin.available')}</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('admin.saving') : editingId ? t('admin.updateArtwork') : t('admin.addArtwork')}
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
                        category: '',
                      });
                    }}
                  >
                    {t('admin.cancelEdit')}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Artworks List */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.existingArtworks')}</CardTitle>
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
                        {artwork.category && ` • ${artwork.category}`}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        {artwork.is_featured && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            {t('admin.featured')}
                          </span>
                        )}
                        {artwork.is_available && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {t('admin.available')}
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