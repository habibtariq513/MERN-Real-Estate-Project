export default function About() {
  return (
    <main>
      <section
        aria-labelledby="about-heading"
        className="relative flex min-h-[360px] items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-16 sm:min-h-[440px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <h1
          id="about-heading"
          className="relative z-10 text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        >
          About Sahand Estate
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            A better way to find home
          </p>
          <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <p className="mb-4 text-lg leading-relaxed text-slate-600 sm:text-xl">
              <span className="mb-2 block text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Sahand Estate
              </span>
              specializes in helping clients buy, sell, and rent properties in
              the area&apos;s top neighborhoods. We are committed to providing
              exceptional service and helping every client find a place that
              feels right for them.
            </p>
            <div className="h-1 w-16 rounded-full bg-emerald-600" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-bold text-slate-800">
                Our mission
              </h2>
              <p className="leading-relaxed text-slate-600">
                Our mission is to guide clients through every step of their real
                estate journey with market expertise, personalized guidance, and
                transparent advice. We make sure you have the information and
                support you need to make confident decisions.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-bold text-slate-800">
                Our commitment
              </h2>
              <p className="leading-relaxed text-slate-600">
                Our team brings deep industry knowledge and a genuine dedication
                to making buying or renting a property an exciting, stress-free
                experience. We are here to support you from the first
                conversation through the moment you settle into your new home.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
