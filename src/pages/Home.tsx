import { PageHeader } from "@/components/page-header";
import { ArtGalleryCard } from "@/components/art-gallery-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import waterfallPainting from "@/assets/waterfall-painting.jpg";
import shellPainting from "@/assets/shell-painting.jpg";
import boatNightPainting from "@/assets/boat-night-painting.jpg";
import prideTreePainting from "@/assets/pride-tree-painting.jpg";

const featuredArtworks = [
  {
    id: 1,
    title: "The shell",
    year: "1440",
    image: shellPainting,
  },
  {
    id: 2,
    title: "The bout & the night",
    year: "1440", 
    image: boatNightPainting,
  },
  {
    id: 3,
    title: "Water falls",
    year: "1440",
    image: waterfallPainting,
  },
  {
    id: 4,
    title: "Pride",
    year: "1440",
    image: prideTreePainting,
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Home" />
      
      <div className="px-4">
        {/* Main Content Area */}
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          {/* Featured Artworks Grid */}
          <div className="grid grid-cols-2 gap-4">
            {featuredArtworks.map((artwork) => (
              <ArtGalleryCard
                key={artwork.id}
                title={artwork.title}
                year={artwork.year}
                image={artwork.image}
                onClick={() => console.log(`Viewing ${artwork.title}`)}
              />
            ))}
          </div>
          
          {/* Additional artworks - continuing the grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <ArtGalleryCard
              title="Desert Oasis"
              year="1439"
              image={waterfallPainting}
              onClick={() => console.log("Viewing Desert Oasis")}
            />
            <ArtGalleryCard
              title="Coastal Breeze"
              year="1441"
              image={shellPainting}
              onClick={() => console.log("Viewing Coastal Breeze")}
            />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}