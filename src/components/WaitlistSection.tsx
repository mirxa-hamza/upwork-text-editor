'use client';

export default function WaitlistSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-100 via-blue-100 to-sky-200 px-8 py-16 sm:px-16 sm:py-20">
        <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-8">
          {/* Left Text */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <span className="text-lg leading-none">*</span> Early Access
            </div>
            <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Have something in mind? <br /> Let's connect.
            </h2>
            <p className="text-lg text-slate-700">
              Get in early for priority onboarding and founding-member pricing. We're excited to collaborate and build the best tools for you.
            </p>
          </div>

          {/* Right Form Card */}
          <div className="flex flex-col justify-center sm:p-10">
            <a
              href="https://www.buraq.dev/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Join Us <span>&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
