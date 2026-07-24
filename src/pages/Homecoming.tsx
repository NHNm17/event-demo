import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoGallery from "@/components/PhotoGallery";
import PasswordProtection from "@/components/PasswordProtection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Images, Heart } from "lucide-react";
import HomecomingInvitationCard from "@/components/HomecomingInvitationCard";

const Homecoming = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || undefined;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("upload");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("gallery_authenticated");
    setIsAuthenticated(auth === "true");
  }, []);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (activeTab === "gallery" && !isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <HeroSection tableNumber={tableNumber} />
      
      {/* Navigation to Wedding */}
      <div className="flex justify-center py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-blue/50 text-blue hover:bg-blue/5 transition-all duration-300 font-medium"
        >
          <Heart className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <section className="my-1">
        <HomecomingInvitationCard />
      </section>

      <main className="container mx-auto px-4 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-14 bg-card border border-border/50 shadow-soft rounded-full p-1.5">
            <TabsTrigger 
              value="upload" 
              className="rounded-full data-[state=active]:bg-red-100 data-[state=active]:text-red-700 data-[state=active]:shadow-elegant transition-all duration-300 flex items-center gap-2 font-medium"
            >
              <Camera className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger 
              value="gallery" 
              className="rounded-full data-[state=active]:bg-red-100 data-[state=active]:text-red-700 data-[state=active]:shadow-elegant transition-all duration-300 flex items-center gap-2 font-medium"
            >
              <Images className="w-4 h-4" />
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="animate-fade-in">
            <PhotoUpload 
              onUploadComplete={handleUploadComplete}
              tableNumber={tableNumber}
              eventType="homecoming"
            />
          </TabsContent>

          <TabsContent value="gallery" className="animate-fade-in">
            <PhotoGallery refreshTrigger={refreshTrigger} eventType="homecoming" />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-card/50">
  <div className="container mx-auto px-4 text-center space-y-2">
    
    <p className="text-sm text-muted-foreground font-light">
      08th Jan 2026 | Mr ❤︎ Mrs
    </p>

    {/* Created By */}
    <Link
        to="https://www.antwix.lk"
        className="underline underline-offset-4 hover:text-foreground transition-colors"
      >
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
      <span>Developed By:</span>
      <img
        src="/logo-removebg.png"
        alt="Company Logo"
        className="h-10 w-10 opacity-80"
      />
    </div>
    </Link>
  </div>
</footer>
    </div>
  );
};

export default Homecoming;
