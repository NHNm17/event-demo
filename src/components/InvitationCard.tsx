import floralCorners from "/public/flowers-bottom.jpg";
import FloralOrnament from "@/components/FloralOrnament";
import FloralDivider from "@/components/FloralDivider";
import { MapPin } from "lucide-react";


const InvitationCard = () => {
  return (
    <section className="pt-4 pb-4">
      <div
        className="relative mx-auto max-w-2xl px-6 py-19 text-center text-[#3f5f78] font-serif space-y-8"
        // style={{
        //   backgroundImage: `
        //     url(${floralCorners})
        //   `,
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition: "bottom left, bottom right",
        //   backgroundSize: "160px",
        // }}
      >
        {/* Top flourish */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-blue/50" />
          <img
            src="/wedding-ring.png"
            alt="Wedding Rings"
            className="w-12 opacity-70"
          />
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-blue/50" />
        </div>
        <p className="tracking-widest">
          JANUARY | <span className="text-3xl">03rd</span> | 2026
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

export default InvitationCard;
