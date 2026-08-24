import Icon from './Icon';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-upwork-green text-on-primary">
        <Icon name="text_fields" className="text-[18px]" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-on-surface">Upwork Text Formatter</span>
    </a>
  );
}
