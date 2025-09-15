import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArtGalleryCard } from "@/components/art-gallery-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, X, Share2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Gallery() {
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
        .select('id, title, created_year, image_url, medium')
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
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Gallery" />
      
      <div className="px-4">
        {/* Search and Filters */}
        <div className="bg-card rounded-2xl p-4 mb-6 shadow-xl">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search artworks..."
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
              Sort by {sortBy === "year" ? "Year" : "Title"}
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
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img 
                  src={selectedArtwork.image} 
                  alt={selectedArtwork.title}
                  className="w-full h-64 md:h-96 object-cover rounded-t-2xl"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setSelectedArtwork(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => toggleFavorite(selectedArtwork.id)}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(selectedArtwork.id) ? 'fill-current text-red-500' : ''}`} />
                </Button>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-card-foreground mb-2">
                      {selectedArtwork.title}
                    </h1>
                    <p className="text-warm-gold font-medium mb-2">
                      Created in {selectedArtwork.year}
                    </p>
                    <Badge variant="secondary" className="mb-4">
                      {selectedArtwork.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-2">Medium</h3>
                    <p className="text-muted-foreground">{selectedArtwork.medium}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      This artwork represents the traditional techniques and cultural significance of Saudi Arabian art. 
                      Created using {selectedArtwork.medium.toLowerCase()}, it showcases the mastery of light, shadow, and composition 
                      that defines this artistic movement.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1">
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

      <BottomNav />
    </div>
  );
}