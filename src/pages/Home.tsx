import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { Camera, Heart, Sparkles, ArrowRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";

const primaryButtons = [
  {
    title: "Wedding",
    description: "Enter the wedding upload and gallery experience.",
    to: "/wedding",
    icon: Heart,
    accent: "from-rose-500 via-rose-400 to-orange-300",
  },
  {
    title: "Homecoming",
    description: "Open the homecoming photo uploader and gallery.",
    to: "/homecoming",
    icon: Camera,
    accent: "from-sky-500 via-cyan-400 to-emerald-300",
  },
  {
    title: "Thank You Card",
    description: "Generate a placeholder thank-you card page.",
    to: "/thank-you-card",
    icon: Sparkles,
    accent: "from-amber-500 via-yellow-400 to-orange-300",
  },
];

// Alternate slide direction per card: right, left, right
const cardVariants: Variants[] = [
  {
    hidden: { opacity: 0, x: 80 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  },
  {
    hidden: { opacity: 0, x: -80 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  },
  {
    hidden: { opacity: 0, x: 80 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  },
];

const Home = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,hsl(24_95%_94%),transparent_36%),radial-gradient(circle_at_bottom_right,hsl(199_92%_92%),transparent_30%),linear-gradient(180deg,hsl(40_50%_98%),hsl(40_35%_95%))] text-foreground">
      <HeroSection />
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute left-0 top-10 h-40 w-40 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute right-0 top-28 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 max-w-2xl"
            >
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg text-center">
                Choose the experience you want to open.
              </p>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-3">
              {primaryButtons.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    variants={cardVariants[index]}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                  >
                    <Link
                      to={item.to}
                      className="group relative block overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.15)]"
                    >
                      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent} origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100`} />
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-900"
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>
                      <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                        Open page
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;