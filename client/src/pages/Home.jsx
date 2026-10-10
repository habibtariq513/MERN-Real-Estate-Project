import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <section className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
          alt="Modern home surrounded by landscaped grounds"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl flex-col items-start justify-center gap-6 px-4 py-16">
          <div className="flex max-w-2xl flex-col items-start gap-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-6xl">
              Find your next perfect place with ease
            </h1>
            <p className="text-sm text-white/90 sm:text-base">
              Discover a place to call home, from welcoming apartments to
              beautiful houses for sale and rent.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center justify-center rounded-lg border border-white px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base"
            >
              Let&apos;s get started...
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
