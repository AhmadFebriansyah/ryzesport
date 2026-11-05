export default function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm hover:text-accent">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 cursor-pointer accent-neutral-950"
      />
      {label}
    </label>
  );
}
