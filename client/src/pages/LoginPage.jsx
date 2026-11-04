import { Link, useSearchParams } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import TextField from '../components/TextField.jsx';
import { login } from '../lib/session.js';

export default function LoginPage() {
  const [searchParams] = useSearchParams();

  return (
    <AuthForm
      title="Masuk"
      submitLabel="Masuk"
      onSubmit={({ email, password }) => login(email, password)}
      footer={
        <>
          Belum punya akun?{' '}
          <Link
            to={{ pathname: '/daftar', search: searchParams.toString() }}
            className="font-semibold underline hover:text-accent"
          >
            Daftar
          </Link>
        </>
      }
    >
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
    </AuthForm>
  );
}
