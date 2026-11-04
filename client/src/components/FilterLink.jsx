import { Link } from 'react-router-dom';

export default function FilterLink({ to, active, children }) {
  const style = active
    ? 'border-neutral-950 bg-neutral-950 text-white'
    : 'border-neutral-300 hover:border-neutral-950';

  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`whitespace-nowrap border px-4 py-2 text-sm font-semibold ${style}`}
    >
      {children}
    </Link>
  );
}
