import { Heart } from "lucide-react";

interface HeroSectionProps {
  tableNumber?: string;
}

const HeroSection = ({ tableNumber }: HeroSectionProps) => {
  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover scale-105 blur-none"
        style={{ backgroundImage: "url('/HERO-BG.jpg')" }}
      />

      {/* White Overlay for readability */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-xs" />

      {/* Soft color blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-light/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky/20 rounded-full blur-3xl" />

      {/* Decorative floating element */}
      {/* <div className="absolute top-10 left-10 text-blue-light/30 animate-float">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3" opacity="0.3" />
        </svg>
      </div> */}

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-foreground mb-4 tracking-tight">
          <span className="block text-[20px] font-semibold uppercase tracking-[7px]">
            THE HOMECOMING OF
          </span>
          <span className="block text-gradient-red/50 italic font-[cursive] font-semibold drop-shadow-sm">
            Adisha &amp; Deshani
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-foreground max-w-2xl mx-auto mb-8 font-regular">
          Share your cherished moments from this beautiful celebration.
          Every photo tells a story of love and joy.
        </p>

        {/* Table number */}
        {tableNumber && (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-red/20 shadow-soft">
            <span className="text-sm text-muted-foreground">You're at</span>
            <span className="text-lg font-display font-semibold text-red">
              Table {tableNumber}
            </span>
          </div>
        )}

        {/* Bottom dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          <div className="w-2 h-2 rounded-full bg-red/30" />
          <div className="w-3 h-3 rounded-full bg-red/50" />
          <div className="w-2 h-2 rounded-full bg-red/30" />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
