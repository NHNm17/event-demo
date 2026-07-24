import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Mail, Heart } from "lucide-react";

const ThankYouCard = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(44_100%_95%),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(199_90%_92%),transparent_28%),linear-gradient(180deg,hsl(40_50%_98%),hsl(40_35%_95%))] px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-soft backdrop-blur transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-800">
              <Sparkles className="h-4 w-4" />
              Thank You Card
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Placeholder page for a future thank-you card generator.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              This page is ready for a custom thank-you card flow, message editor, or export button later. For now it gives you a clean destination from the home screen.
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-soft">
                <Heart className="h-4 w-4 text-rose-500" />
                Personalized message
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-soft">
                <Mail className="h-4 w-4 text-sky-500" />
                Shareable layout
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 h-28 w-28 rounded-full bg-rose-200/40 blur-3xl" />
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur">
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-[linear-gradient(180deg,hsl(0_0%_100%),hsl(40_50%_97%))] p-6 sm:p-8">
                <div className="mx-auto flex max-w-md flex-col items-center rounded-[1.5rem] border border-white/80 bg-white px-6 py-10 text-center shadow-elegant">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-white shadow-glow">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.45em] text-amber-700">Thank you</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">A future card preview</h2>
                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    This placeholder card can later become a real design with your event copy, guest names, and a download option.
                  </p>
                  <div className="mt-8 grid w-full gap-3 text-sm text-slate-600">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">Custom thank-you wording</div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">Image or artwork preview</div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">Export / share actions later</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouCard;