const App = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,hsl(42_70%_92%),hsl(35_50%_96%)_40%,hsl(220_30%_98%)_100%)] text-foreground">
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,hsl(42_90%_85%/0.35),transparent)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 sm:px-10 lg:px-12">
        <section className="grid w-full gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-white/75 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-amber-900 shadow-soft backdrop-blur">
              Event Demo
            </div>

            <div className="space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.5em] text-amber-700">
                Invitation starter
              </p>
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                A clean new base for your next event.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                The old wedding template, public images, and route structure have been cleared out so you can rebuild this project around your new event content.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                Ready for a fresh Supabase setup
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
                Neutral layout with no old photos
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-amber-200/50 blur-2xl" />
            <div className="absolute -bottom-10 right-0 h-28 w-28 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
              <div className="aspect-[4/5] rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,hsl(45_100%_97%),hsl(0_0%_100%))] p-6">
                <div className="flex h-full flex-col justify-between rounded-[1.2rem] border border-dashed border-amber-200 bg-white/70 p-6">
                  <div className="space-y-2 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.45em] text-amber-700">Your event</p>
                    <h2 className="text-3xl font-semibold text-slate-900">Coming Soon</h2>
                    <p className="text-sm leading-6 text-slate-500">
                      Drop in the new gallery, RSVP flow, or invitation details here.
                    </p>
                  </div>
                  <div className="grid gap-3 text-sm text-slate-600">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">Custom hero section</div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">Supabase-backed uploads</div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">Event-specific styling</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default App;
