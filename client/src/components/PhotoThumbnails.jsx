export default function PhotoThumbnails({ photos, index, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {photos.map((foto, i) => (
        <button
          key={foto}
          type="button"
          aria-label={`Foto ${i + 1} dari ${photos.length}`}
          aria-pressed={i === index}
          onClick={() => onSelect(i)}
          className={`h-16 w-16 shrink-0 border-2 bg-neutral-100 md:h-20 md:w-20 ${
            i === index ? 'border-neutral-950' : 'border-transparent hover:border-neutral-300'
          }`}
        >
          <img src={foto} alt="" width="80" height="80" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  );
}
