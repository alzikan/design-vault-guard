import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArtGalleryCard } from "@/components/art-gallery-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Heart, X, Share2, Download, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Gallery() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("year");
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);

  // Fetch artworks from database
  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('id, title, created_year, image_url, medium, description, price')
        .eq('is_available', true);
      
      if (error) throw error;
      
      if (data) {
        setArtworks(data.map(artwork => ({
          ...artwork,
          year: artwork.created_year?.toString() || '',
          image: artwork.image_url,
          category: artwork.medium || 'Other'
        })));
        
        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.map(artwork => artwork.medium).filter(Boolean))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('artFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (artworkId: number) => {
    const newFavorites = favorites.includes(artworkId)
      ? favorites.filter(id => id !== artworkId)
      : [...favorites, artworkId];
    
    setFavorites(newFavorites);
    localStorage.setItem('artFavorites', JSON.stringify(newFavorites));
  };

  const viewArtwork = (artwork: any) => {
    setSelectedArtwork(artwork);
  };

  const filteredArtworks = useMemo(() => {
    let filtered = artworks.filter(artwork => {
      const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory;
      return matchesCategory;
    });

    // Sort artworks
    filtered.sort((a, b) => {
      if (sortBy === "year") {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
      }
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    return filtered;
  }, [artworks, selectedCategory, sortBy]);

  const featuredArtwork = filteredArtworks.find(artwork => artwork.is_featured) || filteredArtworks[0];
  const otherArtworks = filteredArtworks.filter(artwork => artwork.id !== featuredArtwork?.id).slice(0, 6);

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Gallery" />
      
      <div className="px-4">
        {/* Filters and Sort Options */}
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/20 mb-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-warm-gold text-background hover:bg-warm-gold/90 rounded-full" 
                  : "bg-background/50 border-border/30 hover:bg-background/70 rounded-full"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === "year" ? "title" : "year")}
              className="bg-background/50 border-border/30 hover:bg-background/70 rounded-full"
            >
              {t('gallery.sortBy')} {sortBy === "year" ? t('gallery.year') : t('gallery.title_sort')}
            </Button>
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
                  onClick={() => viewArtwork(featuredArtwork)}
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
                      onClick={() => viewArtwork(artwork)}
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

        {/* Artwork Detail Modal */}
        {selectedArtwork && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl">
              {/* Header with close and favorite buttons */}
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
                      <h1 className="text-xl font-bold text-foreground">
                        {selectedArtwork.title}
                      </h1>
                      <p className="text-sm text-warm-gold font-medium">
                        Created in {selectedArtwork.year}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-muted/30 hover:bg-muted/50 border border-border/20"
                    onClick={() => setSelectedArtwork(null)}
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row max-h-[calc(95vh-100px)]">
                {/* Image Section */}
                <div className="flex-1 bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center p-8">
                  <img 
                    src={selectedArtwork.image} 
                    alt={selectedArtwork.title}
                    className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-lg ring-1 ring-border/20"
                  />
                </div>
                
                {/* Details Section */}
                <div className="lg:w-96 bg-card/50 backdrop-blur-sm border-l border-border/20 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* Category and Price */}
                    <div className="space-y-3">
                      <Badge variant="secondary" className="bg-warm-gold/10 text-warm-gold border-warm-gold/20">
                        {selectedArtwork.category}
                      </Badge>
                      {selectedArtwork.price && (
                        <div className="text-3xl font-bold text-warm-gold">
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
                      <p className="text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border/20">
                        {selectedArtwork.medium || 'Not specified'}
                      </p>
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-warm-gold"></div>
                        Description
                      </h3>
                      <p className="text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border/20 leading-relaxed">
                        {selectedArtwork.description || 'This beautiful artwork speaks for itself through its visual elements and artistic expression.'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
                      <Button variant="outline" className="w-full bg-muted/20 hover:bg-muted/40 border-border/20">
                        <Share2 className="w-4 h-4 mr-2" />
                        {t('gallery.share')}
                      </Button>
                      <Button variant="outline" className="w-full bg-muted/20 hover:bg-muted/40 border-border/20">
                        <Download className="w-4 h-4 mr-2" />
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

      <BottomNav />
    </div>
  );
}