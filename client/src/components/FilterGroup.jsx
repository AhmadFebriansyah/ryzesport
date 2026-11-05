export default function FilterGroup({ title, children }) {
  return (
    <details open className="group border-b border-neutral-200 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between font-display text-sm font-black uppercase tracking-tight [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden="true" className="text-lg leading-none group-open:hidden">
          +
        </span>
        <span aria-hidden="true" className="hidden text-lg leading-none group-open:inline">
          -
        </span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}
