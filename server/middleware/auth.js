import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET belum diisi. Lihat server/.env.example.');
}

const JWT_ALGORITHM = 'HS256';

export function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    subject: String(userId),
    expiresIn: '7d',
  });
}

export function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Silakan masuk terlebih dulu.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ message: 'Sesi berakhir. Silakan masuk kembali.' });
  }
}
