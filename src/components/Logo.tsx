import Link from 'next/link';
import Icon from './Icon';

type LogoProps = {
  className?: string;
  /** Use on dark backgrounds (e.g. the footer) so the wordmark stays legible. */
  light?: boolean;
};

export default function Logo({ className = '', light = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-on-brand">
        <Icon name="text_fields" className="text-[18px]" />
      </span>
      <span className={`text-[15px] font-semibold tracking-tight ${light ? 'text-white' : 'text-on-surface'}`}>
        Upwork Text Formatter
      </span>
    </Link>
  );
}
