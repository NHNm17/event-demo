import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface CurtainIntroProps {
  onDone: () => void;
}

const CurtainIntro = ({ onDone }: CurtainIntroProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => setIsOpen(true), 900);
    const doneTimer = setTimeout(() => onDone(), 900 + 1400);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: isOpen ? "-100%" : 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-rose-600 via-rose-500 to-amber-400 shadow-[10px_0_40px_rgba(0,0,0,0.25)]"
        >
          <div className="absolute inset-0 opacity-10 [background-image:repeating-linear-gradient(90deg,white_0px,white_2px,transparent_2px,transparent_18px)]" />
        </motion.div>

        <motion.div
          initial={{ x: 0 }}
          animate={{ x: isOpen ? "100%" : 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-bl from-rose-600 via-rose-500 to-amber-400 shadow-[-10px_0_40px_rgba(0,0,0,0.25)]"
        >
          <div className="absolute inset-0 opacity-10 [background-image:repeating-linear-gradient(90deg,white_0px,white_2px,transparent_2px,transparent_18px)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.8 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur"
          >
            <Heart className="h-8 w-8 fill-white text-white" />
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CurtainIntro;