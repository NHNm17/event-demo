import { MapPin } from "lucide-react";

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
        <div className="flex items-center justify-center gap-10">
      {[...Array(3)].map((_, i) => (
        <img
        key={i}
        src="/wine-rose.png"
        alt="Floral"
        className="w-14 opacity-50"
        />
      ))}
      </div>
      </div>
    </section>
  );
};

export default HomecomingInvitationCard;
