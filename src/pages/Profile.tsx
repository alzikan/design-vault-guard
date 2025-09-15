import { PageHeader } from "@/components/page-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Lock } from "lucide-react";
import artistProfile from "@/assets/artist-profile.jpg";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Profile" showLanguageToggle={false} />
      
      <div className="px-4">
        <div className="bg-card rounded-2xl p-6 shadow-xl">
          {/* Profile Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-warm-gold/30 mb-4">
              <img 
                src={artistProfile}
                alt="Ibrahim Mousa alZikan"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-card-foreground">
              Ibrahim Mousa alZikan
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Traditional Saudi Artist
            </p>
          </div>

          {/* Biography */}
          <Card className="bg-muted/30 border-border/20 p-4 mb-6">
            <p className="text-card-foreground text-sm leading-relaxed">
              Born in Onaizah, Saudi Arabia 1386h. He graduated with a B.A. degree from KSU (King Saud University), Faculty of Science in 1409h. He retired in Onaizah. He had participated several times in national and international exhibitions which had been held by the university, The Saudi Arabia Society For Culture & Arts, and The General Presidency of Youth Welfare.
            </p>
          </Card>

          {/* Profile Information */}
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="name" className="text-card-foreground">Name</Label>
              <Input 
                id="name"
                defaultValue="Ibrahim Mousa alZikan"
                className="bg-muted/30 border-border/20"
                readOnly
              />
            </div>
            
            <div>
              <Label htmlFor="mobile" className="text-card-foreground">Mobile Number</Label>
              <Input 
                id="mobile"
                defaultValue="0593321454"
                className="bg-muted/30 border-border/20"
                readOnly
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <Input 
                id="email"
                defaultValue="ibrahim.alzikan@example.com"
                className="bg-muted/30 border-border/20"
                readOnly
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full bg-muted/30 border-border/20 hover:bg-muted/50"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            
            <Button 
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}