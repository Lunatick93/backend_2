import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET no definido en .env");

/**
  @param {Object} user - datos del usuario
  @returns {String} 
 */
export function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "24h" });
}

/**
 * @param {String} token - token JWT
 * @returns {Object} 
 * @throws {Error} si el token es invalido
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error(`Token inválido: ${err.message}`);
  }
}

/**
 * @param {String} authHeader - header authorization (para testear en postman)
 * @returns {String} 
 */
export function extractToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
