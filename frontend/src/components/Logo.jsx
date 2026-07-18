export default function Logo({ light = true }) {
  const base = light ? '#ffffff' : '#1f2937';

  return (
    <div className="flex items-center gap-2">
      <svg width="22" height="22" viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H26.663V26.663L0 0Z" fill={base} />
        <path d="M0 0H19.997L13.331 13.332L0 0Z" fill="#000000" fillOpacity="0.15" />
        <path d="M0 0H13.331L0 26.663V0Z" fill={base} />
      </svg>
      <span className={`font-bold tracking-wide ${light ? 'text-white' : 'text-neutral-900'}`}>
        RED PRODUCT
      </span>
    </div>
  );
}