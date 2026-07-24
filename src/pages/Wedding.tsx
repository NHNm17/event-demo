import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoGallery from "@/components/PhotoGallery";
import PasswordProtection from "@/components/PasswordProtection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Images, Home } from "lucide-react";
import InvitationCard from "@/components/InvitationCard";
// import WeddingDecorations from "@/components/WeddingDecorations";


const Wedding = () => {
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
      {/* <WeddingDecorations /> */}
      {/* Hero Section */}
      <HeroSection tableNumber={tableNumber} />
      
      {/* Navigation to Homecoming */}
      <div className="flex justify-center py-4">
        <Link
          to="/homecoming"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-red-400 text-red-700 hover:bg-red-50 transition-all duration-300 font-medium"
        >
          <Home className="w-4 h-4" />
          View Homecoming Day Uploader
        </Link>
      </div>

      <section className="my-1">
        <InvitationCard />
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        {/* <div className="text-center mb-8">
          <h2 className="text-2xl font-display text-foreground">Wedding Day Gallery</h2>
          <p className="text-muted-foreground">Share your moments from January 3rd, 2026</p>
        </div> */}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-14 bg-card border border-border/50 shadow-soft rounded-full p-1.5">
            <TabsTrigger 
              value="upload" 
              className="rounded-full data-[state=active]:bg-blue-light data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant transition-all duration-300 flex items-center gap-2 font-medium"
            >
              <Camera className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger 
              value="gallery" 
              className="rounded-full data-[state=active]:bg-blue-light data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant transition-all duration-300 flex items-center gap-2 font-medium"
            >
              <Images className="w-4 h-4" />
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="animate-fade-in">
            <PhotoUpload 
              onUploadComplete={handleUploadComplete}
              tableNumber={tableNumber}
              eventType="wedding"
            />
          </TabsContent>

          <TabsContent value="gallery" className="animate-fade-in">
            <PhotoGallery refreshTrigger={refreshTrigger} eventType="wedding" />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-card/50">
  <div className="container mx-auto px-4 text-center space-y-2">
    
    <p className="text-sm text-muted-foreground font-light">
      03rd Jan 2026 | Adisha ❤︎ Deshani
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

export default Wedding;
