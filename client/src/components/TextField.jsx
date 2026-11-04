export default function TextField({ label, ...inputProps }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        {...inputProps}
        className="mt-1 min-h-11 w-full border border-neutral-300 px-3 focus:border-neutral-950 focus:outline-none"
      />
    </label>
  );
}
