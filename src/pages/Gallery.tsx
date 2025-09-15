import { PageHeader } from "@/components/page-header";
import { ArtGalleryCard } from "@/components/art-gallery-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Button } from "@/components/ui/button";
import waterfallPainting from "@/assets/waterfall-painting.jpg";
import shellPainting from "@/assets/shell-painting.jpg";
import boatNightPainting from "@/assets/boat-night-painting.jpg";
import prideTreePainting from "@/assets/pride-tree-painting.jpg";

const galleryCategories = [
  {
    title: "Airbrush",
    artworks: [
      { title: "Water falls", year: "1440", image: waterfallPainting },
      { title: "Pride", year: "1440", image: prideTreePainting },
    ]
  },
  {
    title: "Sketches", 
    artworks: [
      { title: "The shell", year: "1440", image: shellPainting },
      { title: "The bout & the night", year: "1440", image: boatNightPainting },
    ]
  },
  {
    title: "Oil paint",
    artworks: [
      { title: "Desert Dreams", year: "1439", image: waterfallPainting },
      { title: "Ocean Memories", year: "1441", image: prideTreePainting },
    ]
  }
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Gallery" />
      
      <div className="px-4">
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          {galleryCategories.map((category, index) => (
            <div key={category.title} className={index > 0 ? "mt-8" : ""}>
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-card-foreground">
                  {category.title}
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-warm-gold hover:text-accent-foreground hover:bg-accent/20"
                >
                  See All
                </Button>
              </div>
              
              {/* Artworks Grid */}
              <div className="grid grid-cols-2 gap-4">
                {category.artworks.map((artwork, artIndex) => (
                  <ArtGalleryCard
                    key={`${category.title}-${artIndex}`}
                    title={artwork.title}
                    year={artwork.year}
                    image={artwork.image}
                    onClick={() => console.log(`Viewing ${artwork.title}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}