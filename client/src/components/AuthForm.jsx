import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Hanya path internal yang diikuti, agar parameter next tidak bisa mengarah ke situs lain.
function safeNext(next) {
  return next?.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : '/';
}

export default function AuthForm({ title, submitLabel, onSubmit, footer, children }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      navigate(safeNext(searchParams.get('next')), { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-4xl font-black uppercase tracking-tight">{title}</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {children}
        {error ? (
          <p role="alert" className="text-sm font-semibold text-accent">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="min-h-14 bg-accent px-8 text-sm font-semibold uppercase tracking-wide text-neutral-950 hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
        >
          {submitting ? 'Memproses...' : submitLabel}
        </button>
      </form>
      <p className="mt-6 text-sm text-neutral-600">{footer}</p>
    </div>
  );
}
