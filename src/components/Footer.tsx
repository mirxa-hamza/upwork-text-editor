export default function Footer() {
  return (
    <footer className="mt-12 w-full rounded-t-[3rem] bg-white px-6 py-16 sm:rounded-t-[4rem] sm:px-12 sm:py-24 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-16 lg:flex-row lg:gap-8">
        {/* Left Side */}
        <div className="flex max-w-sm flex-col items-start gap-6">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            We would love <br /> to hear from you.
          </h2>
          <p className="text-sm text-slate-500">
            Feel free to reach out if you want to collaborate with us, or simply have a chat.
          </p>
        </div>

        {/* Right Side Columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8 lg:w-2/5">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <a href="https://www.buraq.dev/contact" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-900 hover:underline">
              Contact us
            </a>
            <ul className="flex flex-col gap-4 text-sm text-slate-600">
              <li><a href="/privacy" className="hover:text-slate-900">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-slate-900">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <h3 className="font-bold text-slate-900">Links</h3>
            <ul className="flex flex-col gap-4 text-sm text-slate-600">
              <li><a href="#editor" className="hover:text-slate-900">Editor</a></li>
              <li><a href="#why-format" className="hover:text-slate-900">Why Format</a></li>
              <li><a href="#how-it-works" className="hover:text-slate-900">How It Works</a></li>
              <li><a href="#faq" className="hover:text-slate-900">FAQ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
