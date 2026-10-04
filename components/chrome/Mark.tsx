// Brand mark: a sail over a single swell line, drawn as one continuous stroke
// family so it reads at 16px and at 160px.
export default function Mark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} fill="none">
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id="mark-sail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5ef2d6" />
          <stop offset="1" stopColor="#5aa9ff" />
        </linearGradient>
        <linearGradient id="mark-sea" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5aa9ff" />
          <stop offset="0.55" stopColor="#ffb547" />
          <stop offset="1" stopColor="#ff5d8f" />
        </linearGradient>
      </defs>
      <path d="M16.5 3.5 L16.5 21 L26 21 Z" fill="url(#mark-sail)" opacity="0.95" />
      <path d="M14.5 7 L14.5 21 L7 21 Z" fill="url(#mark-sail)" opacity="0.55" />
      <path d="M3 25.5 C 7 23, 11 28, 16 25.5 S 25 23, 29 25.5" stroke="url(#mark-sea)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
