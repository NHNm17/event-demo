import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HeroSectionProps {
  tableNumber?: string;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const HeroSection = ({ tableNumber }: HeroSectionProps) => {
  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover scale-105 blur-none"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />

      {/* White Overlay for readability */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-xs" />

      {/* Soft color blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-light/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky/20 rounded-full blur-3xl" />

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative container mx-auto px-4 text-center"
      >

        {/* Blinking heart */}
        <motion.div variants={fadeUp} className="mb-3 flex justify-center">
          <motion.div
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="h-5 w-5 fill-rose-400 text-rose-400" />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-foreground mb-4 tracking-tight"
        >
          <span className="block text-[20px] font-semibold uppercase tracking-[7px]">
            THE EVENT OF
          </span>
          <span className="block text-gradient-red/50 italic font-[cursive] font-semibold drop-shadow-sm">
            Mr &amp; Mrs
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-lg sm:text-xl text-foreground max-w-2xl mx-auto mb-8 font-regular"
        >
          Share your cherished moments from this beautiful celebration.
          Every photo tells a story of love and joy.
        </motion.p>

      </motion.div>
    </section>
  );
};

export default HeroSection;