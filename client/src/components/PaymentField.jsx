import { useState } from 'react';
import { BANK, JENIS_BAYAR } from '../lib/orders.js';
import ChoiceField from './ChoiceField.jsx';

export default function PaymentField() {
  const [jenis, setJenis] = useState(null);

  return (
    <div className="flex flex-col gap-3">
      <ChoiceField
        legend="Metode pembayaran (simulasi)"
        name="jenis_bayar"
        options={JENIS_BAYAR}
        gridClass="grid-cols-2"
        onChange={setJenis}
      />
      {jenis === 'TRANSFER' ? (
        <ChoiceField legend="Pilih bank" name="metode_bayar" options={BANK} gridClass="grid-cols-2 sm:grid-cols-4" />
      ) : null}
      {jenis === 'QRIS' ? <input type="hidden" name="metode_bayar" value="QRIS" /> : null}
    </div>
  );
}
