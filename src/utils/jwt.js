import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu_secret_key_segura_aca";

/**
  @param {Object} user - Datos del usuario
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

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

/**
 * @param {String} token - Token JWT
 * @returns {Object} Payload del token
 * @throws {Error} Si el token es inválido
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error(`Token inválido: ${err.message}`);
  }
}

/**
 * @param {String} authHeader - Header Authorization
 * @returns {String} Token sin "Bearer "
 */
export function extractToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
