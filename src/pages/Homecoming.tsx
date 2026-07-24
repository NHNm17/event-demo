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
      {/* Homecoming Hero Section */}
      {/* <section className="relative w-full py-16 sm:py-24 overflow-hidden">        
        <div className="absolute inset-0 bg-gradient-to-b from-red-50 to-background" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-200/30 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-red-400/50" />
            <Heart className="w-6 h-6 text-red-500 fill-red-200" />
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-red-400/50" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-foreground mb-4 tracking-tight">
            <span className="block text-[20px] font-semibold uppercase tracking-[7px] text-red-600">HOMECOMING</span>
            <span className="text-red-700 italic font-semibold">Adisha & Deshani</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-light">
            Celebrate with us as we begin our new journey together.
          </p>

          {tableNumber && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-red-200 shadow-soft">
              <span className="text-sm text-muted-foreground">You're at</span>
              <span className="text-lg font-display font-semibold text-red-600">Table {tableNumber}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-10">
            <div className="w-2 h-2 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-red-300" />
          </div>
        </div>
      </section> */}
      
      {/* Navigation to Wedding */}
      <div className="flex justify-center py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-blue/50 text-blue hover:bg-blue/5 transition-all duration-300 font-medium"
        >
          <Heart className="w-4 h-4" />
          View Wedding Day Uploader
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
      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-card/50">
  <div className="container mx-auto px-4 text-center space-y-2">
    
    <p className="text-sm text-muted-foreground font-light">
      08th Jan 2026 | Adisha ❤︎ Deshani
    </p>

    {/* Created By */}
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
      <span>Created By:</span>
      <img
        src="/company-logo-h.jpg"
        alt="Company Logo"
        className="h-5 w-auto opacity-80"
      />
      <span className="mx-1">|</span>

      <Link
        to="/more-details"
        className="underline underline-offset-4 hover:text-foreground transition-colors"
      >
        more details
      </Link>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Homecoming;
