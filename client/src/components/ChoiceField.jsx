export default function ChoiceField({ legend, name, options }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{legend}</legend>
      <div className="mt-1 grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <label key={option.value} className="block cursor-pointer">
            <input type="radio" name={name} value={option.value} required className="peer sr-only" />
            <span className="flex min-h-11 items-center justify-center border border-neutral-300 px-3 text-center text-sm font-semibold peer-checked:border-neutral-950 peer-checked:bg-neutral-950 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
