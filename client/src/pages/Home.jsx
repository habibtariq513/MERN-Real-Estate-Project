import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section className="max-w-6xl mx-auto p-3">
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl sm:min-h-[500px]">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
            alt="Modern home surrounded by landscaped grounds"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="relative z-10 flex min-h-[420px] max-w-2xl flex-col items-start justify-center gap-6 p-8 sm:min-h-[500px] sm:p-12">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-6xl">
              Find your next perfect place with ease
            </h1>
            <p className="text-sm text-white/90 sm:text-base">
              Discover a place to call home, from welcoming apartments to
              beautiful houses for sale and rent.
            </p>
            <Link
              to="/search"
              className="text-sm font-bold text-white underline decoration-white/70 underline-offset-4 hover:decoration-white sm:text-base"
            >
              Let&apos;s get started...
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
