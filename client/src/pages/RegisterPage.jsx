import { Link, useSearchParams } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import TextField from '../components/TextField.jsx';
import { register } from '../lib/session.js';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();

  return (
    <AuthForm
      title="Daftar"
      submitLabel="Buat Akun"
      onSubmit={register}
      footer={
        <>
          Sudah punya akun?{' '}
          <Link
            to={{ pathname: '/masuk', search: searchParams.toString() }}
            className="font-semibold underline hover:text-accent"
          >
            Masuk
          </Link>
        </>
      }
    >
      <TextField label="Nama" name="nama" autoComplete="name" required minLength={2} maxLength={100} />
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <TextField label="Telepon (opsional)" name="telepon" type="tel" autoComplete="tel" />
      <TextField
        label="Password (minimal 8 karakter)"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
    </AuthForm>
  );
}
