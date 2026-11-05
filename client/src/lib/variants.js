// Ukuran null berarti cukup ada stok di ukuran mana pun.
export function colorHasStock(color, size = null) {
  return color.varian.some((variant) => variant.stok > 0 && (size === null || variant.ukuran === size));
}

// Warna null berarti cukup ada stok di warna mana pun.
export function sizeHasStock(colors, size, selectedColor = null) {
  return (selectedColor ? [selectedColor] : colors).some((color) => colorHasStock(color, size));
}

// Gabungan ukuran semua warna, karena tiap warna bisa punya ukuran yang berbeda.
export function allSizes(colors) {
  const sizes = new Set(colors.flatMap((color) => color.varian.map((variant) => variant.ukuran)));
  return [...sizes].sort((a, b) => a - b);
}
