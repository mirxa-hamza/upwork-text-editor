import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mb-8 text-base text-slate-600 sm:text-lg">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[#108a00] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0e7500] focus:outline-none focus:ring-2 focus:ring-[#108a00] focus:ring-offset-2"
      >
        Back to Home
      </Link>
    </div>
  );
}
