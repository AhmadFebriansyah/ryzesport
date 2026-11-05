const DURASI = 4000;

const listeners = new Set();
let toast = null;
let timer = null;

function setToast(next) {
  toast = next;
  listeners.forEach((listener) => listener());
}

export function getToast() {
  return toast;
}

export function subscribeToast(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function hideToast() {
  clearTimeout(timer);
  setToast(null);
}

export function showToast(isi) {
  clearTimeout(timer);
  // id baru membuat animasi masuk diputar ulang saat toast diganti.
  setToast({ ...isi, id: Date.now() });
  timer = setTimeout(hideToast, DURASI);
}
