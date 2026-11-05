import { Link } from 'react-router-dom';
import { STORE_INFO } from '../lib/storeInfo.js';

const HEADING_CLASS = 'font-display text-base font-black uppercase tracking-tight text-white';
const LINK_CLASS = 'underline hover:text-white';

export default function Footer() {
  const { whatsappTeks, whatsappUrl, email, jamHari, jamBuka, alamat } = STORE_INFO;

  return (
    <footer className="mt-16 bg-neutral-950 text-sm text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <p className="font-display text-2xl font-black tracking-tight text-white">
          RYZE<span className="text-accent">SPORT</span>
        </p>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          <section>
            <h2 className={HEADING_CLASS}>Hubungi Kami</h2>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <dt>WhatsApp</dt>
              <dd>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                  {whatsappTeks}
                </a>
              </dd>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${email}`} className={LINK_CLASS}>
                  {email}
                </a>
              </dd>
            </dl>
          </section>
          <section>
            <h2 className={HEADING_CLASS}>Jam Operasional</h2>
            <p className="mt-3">{jamHari}</p>
            <p>{jamBuka}</p>
          </section>
          <section>
            <h2 className={HEADING_CLASS}>Lokasi</h2>
            <address className="mt-3 not-italic">
              {alamat.map((baris) => (
                <p key={baris}>{baris}</p>
              ))}
            </address>
          </section>
        </div>

        <p className="mt-8 border-t border-neutral-800 pt-6">
          Tidak berafiliasi dengan merek yang ditampilkan. Merek, logo, dan nama produk adalah milik
          pemiliknya masing-masing.{' '}
          <Link to="/kredit-foto" className={LINK_CLASS}>
            Kredit foto
          </Link>
        </p>
      </div>
    </footer>
  );
}
