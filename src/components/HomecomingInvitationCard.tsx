import { MapPin } from "lucide-react";

const FloralIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20 8c-2 3-2 6 0 9-2-1-5-1-7 1s-2 5 0 7c-3 0-6 2-6 5 0 1 1 2 2 2 3 0 5-2 6-4 1 2 3 4 5 4s4-2 5-4c1 2 3 4 6 4 1 0 2-1 2-2 0-3-3-5-6-5 2-2 2-5 0-7s-5-2-7-1c2-3 2-6 0-9z"
      fill="currentColor"
      opacity="0.6"
    />
    <circle cx="20" cy="20" r="2.5" fill="currentColor" />
  </svg>
);

const HomecomingInvitationCard = () => {
  return (
    <section className="pt-2 pb-4">
      <div className="mx-auto max-w-2xl px-5 py-10 text-center space-y-4 text-red-700 font-serif  ">

        {/* Top flourish */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-red-500/50" />
            <img
              src="/homecoming-ring.png"
              alt="Wedding Rings"
              className="w-12 opacity-70"
            />
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-red-500/50" />
        </div>

        {/* Date */}
        <p className="tracking-widest">
          JANUARY | <span className="text-3xl">08th</span> | 2026
        </p>
        <div className="flex items-center justify-center gap-10 text-red-300">
          {[...Array(3)].map((_, i) => (
            <FloralIcon key={i} className="w-10 h-10" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomecomingInvitationCard;
