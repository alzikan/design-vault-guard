import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArtGalleryCard } from "@/components/art-gallery-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Heart, X, Share2, Download, ChevronRight, Grid, List, Search, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Gallery() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("year");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);

  // Memoized and optimized fetch function
  const fetchArtworks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('id, title, created_year, image_url, medium, description, price, is_featured')
        .eq('is_available', true);
      
      if (error) throw error;
      
      if (data) {
        // Process data once and memoize the result
        const processedArtworks = data.map(artwork => ({
          ...artwork,
          year: artwork.created_year?.toString() || '',
          image: artwork.image_url,
          category: artwork.medium || 'Other'
        }));
        
        setArtworks(processedArtworks);
        
        // Extract categories efficiently
        const categorySet = new Set(data.map(artwork => artwork.medium).filter(Boolean));
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
  }, []);

  const closeModal = useCallback(() => {
    setSelectedArtwork(null);
  }, []);

  // Optimized filtering and sorting with better memoization
  const filteredAndSortedArtworks = useMemo(() => {
    if (!artworks.length) return { filtered: [], featured: null, others: [] };

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

    return {
      filtered: sorted,
      featured,
      others: others.slice(0, 6) // Only take first 6 for mobile view
    };
  }, [artworks, selectedCategory, sortBy]);

  const { filtered: filteredArtworks, featured: featuredArtwork, others: otherArtworks } = filteredAndSortedArtworks;

  // Mobile Layout (existing)
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <div className="flex items-center p-4 border-b border-border/20">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-3 bg-secondary hover:bg-secondary/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Gallery</h1>
        </div>
        
        <div className="px-4">
          {/* Compact Filters */}
          <div className="bg-card/20 backdrop-blur-sm rounded-xl p-3 border border-border/10 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Pills */}
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-warm-gold text-background hover:bg-warm-gold/90 rounded-full h-7 px-3 text-xs font-medium" 
                    : "bg-transparent hover:bg-muted/40 rounded-full h-7 px-3 text-xs"
                  }
                >
                  {category}
                </Button>
              ))}
              
              {/* Sort Button */}
              <div className="flex items-center ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortBy(sortBy === "year" ? "title" : "year")}
                  className="bg-muted/20 hover:bg-muted/40 rounded-full h-7 px-3 text-xs gap-1"
                >
                  <Filter className="w-3 h-3" />
                  {sortBy === "year" ? "Year" : "A-Z"}
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading artworks...</p>
            </div>
          ) : (
            <>
              {/* Featured Artwork */}
              {featuredArtwork && (
                <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border/20">
                  <h2 className="text-xl font-bold text-foreground mb-4 text-center">
                    {featuredArtwork.title}
                  </h2>
                  <div 
                    className="relative group cursor-pointer"
                    onClick={() => handleArtworkClick(featuredArtwork)}
                  >
                    <img 
                      src={featuredArtwork.image} 
                      alt={featuredArtwork.title}
                      className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white">
                        <p className="font-medium">{featuredArtwork.medium}</p>
                        <p className="text-sm opacity-90">Created in {featuredArtwork.year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Artworks Grid */}
              {otherArtworks.length > 0 && (
                <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">More Designs</h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {otherArtworks.map((artwork) => (
                      <div 
                        key={artwork.id}
                        className="relative group cursor-pointer"
                        onClick={() => handleArtworkClick(artwork)}
                      >
                        <img 
                          src={artwork.image} 
                          alt={artwork.title}
                          className="w-full h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <p className="text-white text-xs font-medium text-center px-2">
                            {artwork.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredArtworks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No artworks found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>

        <BottomNav />

        {/* Artwork Detail Modal - Mobile */}
        {selectedArtwork && (
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div 
              className="bg-background border border-border rounded-3xl w-full max-w-lg max-h-[95vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Modal Header */}
              <div className="relative bg-gradient-to-r from-background/90 to-background/80 backdrop-blur-sm p-4 border-b border-border/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-muted/30 hover:bg-muted/50 border border-border/20"
                      onClick={() => toggleFavorite(selectedArtwork.id)}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(selectedArtwork.id) ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
                    </Button>
                    <div>
                      <h1 className="text-lg font-bold text-foreground">
                        {selectedArtwork.title}
                      </h1>
                      <p className="text-warm-gold font-medium text-sm">
                        Created in {selectedArtwork.year}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-muted/30 hover:bg-muted/50 border border-border/20"
                    onClick={closeModal}
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="max-h-[calc(95vh-80px)] overflow-y-auto">
                {/* Mobile Image Section */}
                <div className="bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center p-6">
                  <img 
                    src={selectedArtwork.image} 
                    alt={selectedArtwork.title}
                    className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-xl ring-1 ring-border/20"
                  />
                </div>
                
                {/* Mobile Details Section */}
                <div className="p-6 space-y-6">
                  {/* Category and Price */}
                  <div className="space-y-3">
                    <Badge variant="secondary" className="bg-warm-gold/10 text-warm-gold border-warm-gold/20 px-3 py-1">
                      {selectedArtwork.category}
                    </Badge>
                    {selectedArtwork.price && (
                      <div className="text-2xl font-bold text-warm-gold">
                        ${selectedArtwork.price}
                      </div>
                    )}
                  </div>

                  {/* Medium */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warm-gold"></div>
                      Medium
                    </h3>
                    <p className="text-muted-foreground bg-muted/30 rounded-xl p-3 border border-border/20 text-sm">
                      {selectedArtwork.medium || 'Not specified'}
                    </p>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warm-gold"></div>
                      Description
                    </h3>
                    <p className="text-muted-foreground bg-muted/30 rounded-xl p-3 border border-border/20 leading-relaxed text-sm">
                      {selectedArtwork.description || 'This beautiful artwork speaks for itself through its visual elements and artistic expression.'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
                    <Button variant="outline" className="w-full bg-muted/20 hover:bg-muted/40 border-border/20 h-10">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Artwork
                    </Button>
                    <Button variant="outline" className="w-full bg-muted/20 hover:bg-muted/40 border-border/20 h-10">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
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
                  Gallery
                </h1>
                <p className="text-card-foreground/70 mt-1">{filteredArtworks.length} artworks</p>
              </div>
            </div>
            
            {/* Desktop Controls */}
            <div className="flex items-center gap-6">
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
                Sort by {sortBy === "year" ? "Year" : "Title"}
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
              <p className="text-card-foreground/70">Loading artworks...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            {featuredArtwork && (
              <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-8 text-card-foreground">Featured Artwork</h2>
                <div 
                  className="relative group cursor-pointer bg-secondary/50 backdrop-blur-sm rounded-3xl p-8 border border-border hover:border-warm-gold/40 transition-all duration-500"
                  onClick={() => handleArtworkClick(featuredArtwork)}
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div>
                        <Badge variant="secondary" className="mb-4 bg-warm-gold/20 text-warm-gold border-warm-gold/30">
                          Featured
                        </Badge>
                        <h3 className="text-3xl font-bold mb-2 text-card-foreground">{featuredArtwork.title}</h3>
                        <p className="text-warm-gold font-medium">Created in {featuredArtwork.year}</p>
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
                <h2 className="text-2xl font-semibold text-card-foreground">Collection</h2>
                <p className="text-card-foreground/70">{otherArtworks.length} pieces</p>
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

              {filteredArtworks.length === 0 && (
                <div className="text-center py-32">
                  <div className="max-w-md mx-auto">
                    <Search className="w-16 h-16 text-muted-foreground/40 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-2">No artworks found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
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
                      Created in {selectedArtwork.year}
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
                      Medium
                    </h3>
                    <p className="text-muted-foreground bg-muted/30 rounded-xl p-4 border border-border/20">
                      {selectedArtwork.medium || 'Not specified'}
                    </p>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-warm-gold"></div>
                      Description
                    </h3>
                    <p className="text-muted-foreground bg-muted/30 rounded-xl p-4 border border-border/20 leading-relaxed">
                      {selectedArtwork.description || 'This beautiful artwork speaks for itself through its visual elements and artistic expression.'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-6 border-t border-border/20">
                    <Button variant="outline" className="w-full bg-muted/20 hover:bg-muted/40 border-border/20 h-12">
                      <Share2 className="w-5 h-5 mr-2" />
                      Share Artwork
                    </Button>
                    <Button variant="outline" className="w-full bg-muted/20 hover:bg-muted/40 border-border/20 h-12">
                      <Download className="w-5 h-5 mr-2" />
                      Download
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