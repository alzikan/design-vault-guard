import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArtGalleryCard } from "@/components/art-gallery-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Heart, X, Share2, Download, ChevronRight, Grid, List, Search, ArrowLeft, ChevronLeft, Edit2, Trash2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Gallery() {
  const { t, toggleLanguage } = useLanguage();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("year");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworksPerPage] = useState(12);
  
  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // Memoized and optimized fetch function
  const fetchArtworks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('id, title, created_year, image_url, medium, description, price, is_featured, category')
        .eq('is_available', true);
      
      if (error) throw error;
      
      if (data) {
        // Process data once and memoize the result
        const processedArtworks = data.map(artwork => ({
          ...artwork,
          year: artwork.created_year?.toString() || '',
          image: artwork.image_url,
          category: artwork.category || 'Other'
        }));
        
        setArtworks(processedArtworks);
        
        // Extract categories efficiently
        const categorySet = new Set(data.map(artwork => artwork.category).filter(Boolean));
        setCategories(["All", ...Array.from(categorySet)]);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch artworks from database
  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('artFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Memoized functions to prevent unnecessary re-renders
  const toggleFavorite = useCallback((artworkId: number) => {
    const newFavorites = favorites.includes(artworkId)
      ? favorites.filter(id => id !== artworkId)
      : [...favorites, artworkId];
    
    setFavorites(newFavorites);
    localStorage.setItem('artFavorites', JSON.stringify(newFavorites));
  }, [favorites]);

  const viewArtwork = useCallback((artwork: any) => {
    setSelectedArtwork(artwork);
  }, []);

  const handleArtworkClick = useCallback((artwork: any) => {
    setSelectedArtwork(artwork);
    fetchComments(artwork.id);
  }, []);
  
  // Fetch comments for selected artwork
  const fetchComments = async (artworkId: string) => {
    setLoadingComments(true);
    try {
      const { data: commentsData, error: commentsError } = await (supabase as any)
        .from('comments')
        .select('*')
        .eq('artwork_id', artworkId)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      // Fetch profile information for each comment
      if (commentsData && commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map((c: any) => c.user_id))] as string[];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);
        
        if (!profilesError && profilesData) {
          const profilesMap = new Map(profilesData.map(p => [p.user_id, p]));
          const commentsWithProfiles = commentsData.map((comment: any) => ({
            ...comment,
            profiles: profilesMap.get(comment.user_id)
          }));
          setComments(commentsWithProfiles);
        } else {
          setComments(commentsData);
        }
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };
  
  // Add new comment
  const handleAddComment = async () => {
    if (!user) {
      toast.error('Please sign in to add a comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      const { data: newCommentData, error } = await (supabase as any)
        .from('comments')
        .insert({
          artwork_id: selectedArtwork.id,
          user_id: user.id,
          comment_text: newComment.trim()
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Fetch profile info for the new comment
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .eq('user_id', user.id)
        .single();
      
      const commentWithProfile = {
        ...newCommentData,
        profiles: profileData
      };
      
      setComments([commentWithProfile, ...comments]);
      setNewComment("");
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };
  
  // Start editing comment
  const handleStartEdit = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.comment_text);
  };
  
  // Update comment
  const handleUpdateComment = async (commentId: string) => {
    if (!editingCommentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      const { error } = await (supabase as any)
        .from('comments')
        .update({ comment_text: editingCommentText.trim() })
        .eq('id', commentId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      setComments(comments.map(c => 
        c.id === commentId 
          ? { ...c, comment_text: editingCommentText.trim() }
          : c
      ));
      setEditingCommentId(null);
      setEditingCommentText("");
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };
  
  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const { error } = await (supabase as any)
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const closeModal = useCallback(() => {
    setSelectedArtwork(null);
    setComments([]);
    setNewComment("");
    setEditingCommentId(null);
    setEditingCommentText("");
  }, []);

  // Optimized filtering and sorting with better memoization
  const filteredAndSortedArtworks = useMemo(() => {
    if (!artworks.length) return { filtered: [], featured: null, others: [], totalPages: 0 };

    // Filter by category first
    const categoryFiltered = selectedCategory === "All" 
      ? artworks 
      : artworks.filter(artwork => artwork.category === selectedCategory);

    // Sort efficiently
    const sorted = [...categoryFiltered].sort((a, b) => {
      if (sortBy === "year") {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
      }
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    // Find featured and separate in one pass
    const featured = sorted.find(artwork => artwork.is_featured) || sorted[0];
    const others = featured ? sorted.filter(artwork => artwork.id !== featured.id) : sorted;
    
    // Calculate pagination
    const totalPages = Math.ceil(others.length / artworksPerPage);
    const startIndex = (currentPage - 1) * artworksPerPage;
    const endIndex = startIndex + artworksPerPage;
    const paginatedOthers = others.slice(startIndex, endIndex);

    return {
      filtered: sorted,
      featured,
      others: paginatedOthers,
      totalPages,
      totalArtworks: others.length
    };
  }, [artworks, selectedCategory, sortBy, currentPage, artworksPerPage]);

  const { filtered: filteredArtworks, featured: featuredArtwork, others: otherArtworks, totalPages, totalArtworks } = filteredAndSortedArtworks;

  // Reset to first page when category or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  // Mobile Layout - Updated to match reference design
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <div className="flex items-center justify-between p-4 pt-12">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-warm-gold/20">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="bg-warm-gold text-white">
                U
              </AvatarFallback>
            </Avatar>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground">{t('gallery.title')}</h1>
          
          {/* Language Toggle */}
          <Button 
            variant="outline" 
            size="sm"
            className="bg-card/50 border-border/20 hover:bg-card/70 text-foreground"
            onClick={toggleLanguage}
          >
            {t('nav.language')}
          </Button>
        </div>
        
        <div className="px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-gold mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('gallery.loading')}</p>
            </div>
          ) : selectedCategory !== "All" ? (
            <>
              {/* Selected Category View */}
              <div className="mb-4 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedCategory("All")}
                  className="h-9 w-9"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-2xl font-bold text-foreground">{selectedCategory}</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pb-8">
                {filteredArtworks.map((artwork) => (
                  <div 
                    key={artwork.id}
                    className="relative group cursor-pointer"
                    onClick={() => handleArtworkClick(artwork)}
                  >
                    <div className="relative overflow-hidden rounded-xl bg-card/30 border border-border/20">
                      <img 
                        src={artwork.image} 
                        alt={artwork.title}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Artwork Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-medium text-sm leading-tight">
                          {artwork.title}
                        </h3>
                        <p className="text-warm-gold text-xs mt-1">
                          {artwork.year}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredArtworks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('gallery.noResults')}</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Category Sections - Following reference design */}
              {categories.filter(cat => cat !== "All").map((category) => {
                const categoryArtworks = artworks.filter(artwork => artwork.category === category);
                
                if (categoryArtworks.length === 0) return null;
                
                return (
                  <div key={category} className="mb-8">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-foreground">{category}</h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-warm-gold hover:text-warm-gold/80"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {t('gallery.seeAll')}
                      </Button>
                    </div>
                    
                    {/* Category Artworks Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {categoryArtworks.slice(0, 4).map((artwork) => (
                        <div 
                          key={artwork.id}
                          className="relative group cursor-pointer"
                          onClick={() => handleArtworkClick(artwork)}
                        >
                          <div className="relative overflow-hidden rounded-xl bg-card/30 border border-border/20">
                            <img 
                              src={artwork.image} 
                              alt={artwork.title}
                              className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Artwork Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="text-white font-medium text-sm leading-tight">
                                {artwork.title}
                              </h3>
                              <p className="text-warm-gold text-xs mt-1">
                                {artwork.year}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <BottomNav />

        {/* Artwork Detail Modal - Updated to match picture_details reference */}
        {selectedArtwork && (
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50"
            onClick={closeModal}
          >
            <div className="relative h-full flex flex-col">
              {/* Back Button */}
              <div className="absolute top-4 left-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 text-white"
                  onClick={closeModal}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>

              {/* Full Screen Image */}
              <div className="flex-1 flex items-center justify-center p-4 pt-16">
                <img 
                  src={selectedArtwork.image} 
                  alt={selectedArtwork.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Bottom Action Bar */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(selectedArtwork.id);
                    }}
                  >
                    <Heart className={`w-6 h-6 ${favorites.includes(selectedArtwork.id) ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white"
                  >
                    <Download className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white"
                  >
                    <Share2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Full Screen Toggle */}
              <div className="absolute bottom-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 border border-white/20 text-white"
                >
                  <div className="flex items-center gap-2">
                    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                      <div className="w-1.5 h-1.5 bg-white"></div>
                      <div className="w-1.5 h-1.5 bg-white"></div>
                      <div className="w-1.5 h-1.5 bg-white"></div>
                      <div className="w-1.5 h-1.5 bg-white"></div>
                    </div>
                    <span className="text-sm">{t('gallery.fullScreen')}</span>
                  </div>
                </Button>
              </div>

              {/* Artwork Info Panel - Expandable */}
              <div 
                className="bg-card/95 backdrop-blur-sm border-t border-border/20 p-6 space-y-4 max-h-[50vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <h1 className="text-xl font-bold text-card-foreground mb-2">
                    {selectedArtwork.title}
                  </h1>
                  {selectedArtwork.description && (
                    <p className="text-card-foreground leading-relaxed">
                      {selectedArtwork.description}
                    </p>
                  )}
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="text-lg font-semibold text-warm-gold mb-3">
                    {comments.length} {t('gallery.comments')}
                  </h3>
                  
                  {/* Comment Input */}
                  {user ? (
                    <div className="mb-4 flex gap-2">
                      <Input 
                        placeholder={t('gallery.addComment')}
                        className="bg-muted/30 border-border/20"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <Button 
                        size="icon"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-muted/20 rounded-lg">
                      <p className="text-sm text-card-foreground">
                        Please sign in to add comments
                      </p>
                    </div>
                  )}
                  
                  {/* Comments List */}
                  {loadingComments ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-gold mx-auto"></div>
                    </div>
                  ) : comments.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {comments.map((comment) => (
                        <div key={comment.id} className="bg-muted/20 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <p className="text-xs font-medium text-foreground">
                                {comment.profiles?.full_name || comment.profiles?.email || 'Anonymous'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {user?.id === comment.user_id && (
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleStartEdit(comment)}
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          {editingCommentId === comment.id ? (
                            <div className="flex gap-2 mt-2">
                              <Input
                                value={editingCommentText}
                                onChange={(e) => setEditingCommentText(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm bg-background"
                                onKeyPress={(e) => e.key === 'Enter' && handleUpdateComment(comment.id)}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleUpdateComment(comment.id)}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <p className="text-card-foreground text-sm">
                              {comment.comment_text}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-card-foreground">
                        No comments yet. Be the first to comment!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout (modern gallery design)
  return (
    <div className="min-h-screen bg-card">
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => navigate('/')}
                className="h-10 w-10 bg-secondary hover:bg-secondary/80"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-card-foreground">
                  {t('gallery.title')}
                </h1>
                <p className="text-card-foreground/70 mt-1">{filteredArtworks.length} {t('gallery.artworks')}</p>
              </div>
            </div>
            
            {/* Desktop Controls */}
            <div className="flex items-center gap-6">
              {/* Language Toggle */}
              <Button 
                variant="outline" 
                size="sm"
                className="bg-card/50 border-border/20 hover:bg-card/70 text-foreground h-9"
                onClick={toggleLanguage}
              >
                {t('nav.language')}
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-9"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "masonry" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("masonry")}
                  className="h-9"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="h-9"
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSortBy(sortBy === "year" ? "title" : "year")}
                className="h-9 gap-2"
              >
                <Filter className="w-4 h-4" />
                {t('gallery.sortBy')} {sortBy === "year" ? t('gallery.year') : t('gallery.title_sort')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-gold mx-auto mb-4"></div>
              <p className="text-card-foreground/70">{t('gallery.loading')}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            {featuredArtwork && (
              <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-8 text-card-foreground">{t('gallery.featuredArtwork')}</h2>
                <div 
                  className="relative group cursor-pointer bg-secondary/50 backdrop-blur-sm rounded-3xl p-8 border border-border hover:border-warm-gold/40 transition-all duration-500"
                  onClick={() => handleArtworkClick(featuredArtwork)}
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div>
                        <Badge variant="secondary" className="mb-4 bg-warm-gold/20 text-warm-gold border-warm-gold/30">
                          {t('gallery.featured')}
                        </Badge>
                        <h3 className="text-3xl font-bold mb-2 text-card-foreground">{featuredArtwork.title}</h3>
                        <p className="text-warm-gold font-medium">{t('gallery.createdIn')} {featuredArtwork.year}</p>
                      </div>
                      <p className="text-card-foreground/80 text-lg leading-relaxed">
                        {featuredArtwork.description || 'A masterful piece showcasing exceptional artistic vision and technical skill.'}
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-secondary/30 text-card-foreground border-border">{featuredArtwork.medium}</Badge>
                        {featuredArtwork.price && (
                          <span className="text-2xl font-bold text-warm-gold">${featuredArtwork.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <img 
                        src={featuredArtwork.image} 
                        alt={featuredArtwork.title}
                        className="w-full h-[500px] object-cover rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Gallery Grid */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-card-foreground">{t('gallery.collection')}</h2>
                <p className="text-card-foreground/70">{totalArtworks || 0} {t('gallery.pieces')}</p>
              </div>
              
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {otherArtworks.map((artwork) => (
                    <div 
                      key={artwork.id}
                      className="group cursor-pointer"
                      onClick={() => handleArtworkClick(artwork)}
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border hover:border-warm-gold/40 transition-all duration-500">
                        <img 
                          src={artwork.image} 
                          alt={artwork.title}
                          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <h3 className="text-xl font-semibold mb-1">{artwork.title}</h3>
                          <p className="text-sm opacity-90">{artwork.year} • {artwork.medium}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 h-10 w-10 bg-black/20 hover:bg-black/40 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(artwork.id);
                          }}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(artwork.id) ? 'fill-current text-red-400' : 'text-white'}`} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
                  {otherArtworks.map((artwork, index) => (
                    <div 
                      key={artwork.id}
                      className="group cursor-pointer break-inside-avoid mb-8"
                      onClick={() => handleArtworkClick(artwork)}
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border hover:border-warm-gold/40 transition-all duration-500">
                        <img 
                          src={artwork.image} 
                          alt={artwork.title}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                            index % 3 === 0 ? 'h-80' : index % 3 === 1 ? 'h-96' : 'h-72'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <h3 className="text-lg font-semibold mb-1">{artwork.title}</h3>
                          <p className="text-sm opacity-90">{artwork.year} • {artwork.medium}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 h-10 w-10 bg-black/20 hover:bg-black/40 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(artwork.id);
                          }}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(artwork.id) ? 'fill-current text-red-400' : 'text-white'}`} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 pb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-10 px-4"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {t('common.previous')}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="h-10 w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-10 px-4"
                  >
                    {t('common.next')}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {filteredArtworks.length === 0 && (
                <div className="text-center py-32">
                  <div className="max-w-md mx-auto">
                    <Search className="w-16 h-16 text-muted-foreground/40 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-2">{t('gallery.noResults')}</h3>
                    <p className="text-muted-foreground">{t('gallery.tryAdjustingFilters')}</p>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-background border border-border rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close and favorite buttons */}
            <div className="relative bg-gradient-to-r from-background/90 to-background/80 backdrop-blur-sm p-6 border-b border-border/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-muted/30 hover:bg-muted/50 border border-border/20"
                    onClick={() => toggleFavorite(selectedArtwork.id)}
                  >
                    <Heart className={`w-6 h-6 ${favorites.includes(selectedArtwork.id) ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {selectedArtwork.title}
                    </h1>
                    <p className="text-warm-gold font-medium">
                      {t('gallery.createdIn')} {selectedArtwork.year}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-muted/30 hover:bg-muted/50 border border-border/20"
                  onClick={closeModal}
                >
                  <X className="w-6 h-6 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row max-h-[calc(95vh-120px)]">
              {/* Image Section */}
              <div className="flex-1 bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center p-12">
                <img 
                  src={selectedArtwork.image} 
                  alt={selectedArtwork.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl ring-1 ring-border/20"
                />
              </div>
              
              {/* Details Section */}
              <div className="lg:w-96 bg-card/50 backdrop-blur-sm border-l border-border/20 overflow-y-auto">
                <div className="p-8 space-y-8">
                  {/* Category and Price */}
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-warm-gold/10 text-warm-gold border-warm-gold/20 px-3 py-1">
                      {selectedArtwork.category}
                    </Badge>
                    {selectedArtwork.price && (
                      <div className="text-4xl font-bold text-warm-gold">
                        ${selectedArtwork.price}
                      </div>
                    )}
                  </div>

                  {/* Medium */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-warm-gold"></div>
                      {t('gallery.medium')}
                    </h3>
                    <p className="text-muted-foreground bg-muted/30 rounded-xl p-4 border border-border/20">
                      {selectedArtwork.medium || t('gallery.notSpecified')}
                    </p>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-warm-gold"></div>
                      {t('gallery.description')}
                    </h3>
                    <p className="text-muted-foreground bg-muted/30 rounded-xl p-4 border border-border/20 leading-relaxed">
                      {selectedArtwork.description || 'This beautiful artwork speaks for itself through its visual elements and artistic expression.'}
                    </p>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-4 pt-6 border-t border-border/20">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-warm-gold"></div>
                      {t('gallery.comments')} ({comments.length})
                    </h3>
                    
                    {/* Comment Input */}
                    {user ? (
                      <div className="flex gap-2">
                        <Input 
                          placeholder={t('gallery.addComment')}
                          className="bg-muted/30 border-border/20"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <Button 
                          size="icon"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <p className="text-sm text-card-foreground">
                          Please sign in to add comments
                        </p>
                      </div>
                    )}
                    
                    {/* Comments List */}
                    {loadingComments ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-gold mx-auto"></div>
                      </div>
                    ) : comments.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {comments.map((comment) => (
                          <div key={comment.id} className="bg-muted/20 rounded-lg p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                  {comment.profiles?.full_name || comment.profiles?.email || 'Anonymous'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              {user?.id === comment.user_id && (
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleStartEdit(comment)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => handleDeleteComment(comment.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            {editingCommentId === comment.id ? (
                              <div className="flex gap-2 mt-2">
                                <Input
                                  value={editingCommentText}
                                  onChange={(e) => setEditingCommentText(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-sm bg-background"
                                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateComment(comment.id)}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateComment(comment.id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {comment.comment_text}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-card-foreground">
                          No comments yet. Be the first to comment!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-6 border-t border-border/20">
                    <Button variant="outline" className="w-full bg-muted/20 hover:bg-muted/40 border-border/20 h-12">
                      <Share2 className="w-5 h-5 mr-2" />
                      {t('gallery.shareArtwork')}
                    </Button>
                    <Button variant="outline" className="w-full bg-muted/20 hover:bg-muted/40 border-border/20 h-12">
                      <Download className="w-5 h-5 mr-2" />
                      {t('gallery.download')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}