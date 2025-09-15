import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArtGalleryCard } from "@/components/art-gallery-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import waterfallPainting from "@/assets/waterfall-painting.jpg";
import shellPainting from "@/assets/shell-painting.jpg";
import boatNightPainting from "@/assets/boat-night-painting.jpg";
import prideTreePainting from "@/assets/pride-tree-painting.jpg";

const allArtworks = [
  { id: 1, title: "Water falls", year: "1440", image: waterfallPainting, category: "Airbrush", medium: "Airbrush on Canvas" },
  { id: 2, title: "Pride", year: "1440", image: prideTreePainting, category: "Airbrush", medium: "Airbrush on Canvas" },
  { id: 3, title: "The shell", year: "1440", image: shellPainting, category: "Sketches", medium: "Pencil on Paper" },
  { id: 4, title: "The bout & the night", year: "1440", image: boatNightPainting, category: "Sketches", medium: "Charcoal on Paper" },
  { id: 5, title: "Desert Dreams", year: "1439", image: waterfallPainting, category: "Oil paint", medium: "Oil on Canvas" },
  { id: 6, title: "Ocean Memories", year: "1441", image: prideTreePainting, category: "Oil paint", medium: "Oil on Canvas" },
  { id: 7, title: "Mountain Serenity", year: "1442", image: shellPainting, category: "Airbrush", medium: "Airbrush on Canvas" },
  { id: 8, title: "Evening Reflection", year: "1439", image: boatNightPainting, category: "Oil paint", medium: "Oil on Canvas" },
];

const categories = ["All", "Airbrush", "Sketches", "Oil paint"];

export default function Gallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("year");

  const filteredArtworks = useMemo(() => {
    let filtered = allArtworks.filter(artwork => {
      const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          artwork.medium.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort artworks
    filtered.sort((a, b) => {
      if (sortBy === "year") return parseInt(b.year) - parseInt(a.year);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

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
          <div className="grid grid-cols-2 gap-4">
            {filteredArtworks.map((artwork) => (
              <ArtGalleryCard
                key={artwork.id}
                title={artwork.title}
                year={artwork.year}
                image={artwork.image}
                onClick={() => console.log(`Viewing ${artwork.title} - ${artwork.medium}`)}
              />
            ))}
          </div>

          {filteredArtworks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No artworks found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}