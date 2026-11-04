import { useSyncExternalStore } from 'react';
import { getCart, subscribeCart } from '../lib/cart.js';

export function useCart() {
  return useSyncExternalStore(subscribeCart, getCart);
}
