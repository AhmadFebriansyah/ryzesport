import { activeTags, clearFilters } from '../lib/productFilters.js';

export default function ActiveFilterTags({ searchParams, options, onChange }) {
  const tags = activeTags(searchParams, options);

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map(({ id, label, next }) => (
        <button
          key={id}
          type="button"
          aria-label={`Hapus filter ${label}`}
          onClick={() => onChange(next)}
          className="flex items-center gap-2 bg-neutral-100 px-3 py-1 text-sm font-semibold hover:bg-neutral-200"
        >
          {label}
          <span aria-hidden="true">×</span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(clearFilters(searchParams))}
        className="text-sm font-semibold underline hover:text-accent"
      >
        Hapus semua
      </button>
    </div>
  );
}
