import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArtGalleryCard } from "@/components/art-gallery-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, X, Share2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Gallery() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
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
      const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (artwork.medium && artwork.medium.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory;
      return matchesSearch && matchesCategory;
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
  }, [artworks, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title={t('nav.gallery')} />
      
      <div className="px-4">
        {/* Search and Filters */}
        <div className="bg-card rounded-2xl p-4 mb-6 shadow-xl">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('gallery.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/30 border-border/20"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-warm-gold text-background hover:bg-warm-gold/90" 
                  : "bg-muted/30 border-border/20 hover:bg-muted/50"
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
              className="bg-muted/30 border-border/20 hover:bg-muted/50"
            >
              {t('gallery.sortBy')} {sortBy === "year" ? t('gallery.year') : t('gallery.title_sort')}
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground text-sm">
            Showing {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading artworks...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                {filteredArtworks.map((artwork) => (
                  <ArtGalleryCard
                    key={artwork.id}
                    title={artwork.title}
                    year={artwork.year}
                    image={artwork.image}
                    onClick={() => viewArtwork(artwork)}
                  />
                ))}
              </div>

              {filteredArtworks.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No artworks found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>

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