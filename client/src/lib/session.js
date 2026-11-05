import { apiRequest } from './api.js';
import { connectCart, disconnectCart, restoreCart } from './cart.js';

const TOKEN_KEY = 'ryzesport_token_v1';

const listeners = new Set();
let session = { user: null, ready: false };

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Sesi tetap berjalan sampai halaman ditutup jika penyimpanan browser diblokir.
  }
}

function setSession(next) {
  session = next;
  listeners.forEach((listener) => listener());
}

export function getSession() {
  return session;
}

export function getToken() {
  return readToken();
}

export function subscribeSession(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function startSession({ token, user }) {
  writeToken(token);
  await connectCart(token);
  setSession({ user, ready: true });
}

export async function login(email, password) {
  await startSession(
    await apiRequest('/api/auth/login', { method: 'POST', body: { email, password } }),
  );
}

export async function register(form) {
  await startSession(await apiRequest('/api/auth/register', { method: 'POST', body: form }));
}

export function logout() {
  writeToken(null);
  disconnectCart();
  setSession({ user: null, ready: true });
}

export async function restoreSession() {
  const token = readToken();
  if (!token) {
    setSession({ user: null, ready: true });
    return;
  }

  try {
    const user = await apiRequest('/api/auth/me', { token });
    await restoreCart(token);
    setSession({ user, ready: true });
  } catch (err) {
    if (err.status === 401) writeToken(null);
    setSession({ user: null, ready: true });
  }
}
