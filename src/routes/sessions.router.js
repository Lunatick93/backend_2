import { Router } from "express";
import * as controller from "../controllers/session.controller.js";
import { authenticateLocal, getCurrent } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * POST /api/sessions/register
 * Registra un nuevo usuario en el sistema
 * 
 * Body:
 * {
 *   "first_name": "Juan",
 *   "last_name": "Pérez",
 *   "email": "juan@example.com",
 *   "age": 25,
 *   "password": "password123"
 * }
 * 
 * Response (201):
 * {
 *   "message": "Usuario registrado exitosamente",
 *   "token": "eyJhbGciOi...",
 *   "user": { ... }
 * }
 */
router.post("/register", controller.register);

/**
 * POST /api/sessions/login
 * Autentica un usuario y genera un JWT válido
 * 
 * Middleware: authenticateLocal
 * - Valida email + password contra la BD
 * - Compara password con hash usando bcrypt.compareSync()
 * 
 * Body:
 * {
 *   "email": "juan@example.com",
 *   "password": "password123"
 * }
 * 
 * Response (200):
 * {
 *   "message": "Login exitoso",
 *   "token": "eyJhbGciOi...",
 *   "user": { ... }
 * }
 * 
 * Errores:
 * - 401: Usuario no encontrado o contraseña incorrecta
 * - 500: Error interno del servidor
 */
router.post("/login", authenticateLocal, controller.login);

/**
 * GET /api/sessions/current
 * ESTRATEGIA PASSPORT "CURRENT": Obtiene datos del usuario logueado
 * 
 * Middleware: getCurrent (USA PASSPORT AUTHENTICATE "CURRENT")
 * - Extrae JWT del header Authorization: Bearer {token}
 * - Valida la firma del token contra JWT_SECRET
 * - Busca el usuario en la BD por payload.id
 * - Devuelve datos del usuario actualizado
 * 
 * Header:
 * Authorization: Bearer eyJhbGciOi...
 * 
 * Response (200):
 * {
 *   "status": "success",
 *   "message": "Usuario autenticado correctamente",
 *   "user": {
 *     "_id": "...",
 *     "first_name": "Juan",
 *     "last_name": "Pérez",
 *     "email": "juan@example.com",
 *     "age": 25,
 *     "role": "user",
 *     "cart": "..."
 *   }
 * }
 * 
 * Errores (401):
 * - Sin token: "Usuario no autenticado"
 * - Token inválido: "Token inválido"
 * - Token expirado: "Token inválido o expirado"
 * - Usuario no existe en BD: "Usuario no encontrado"
 */
router.get("/current", getCurrent, controller.current);

/**
 * POST /api/sessions/logout
 * Cierra la sesión del usuario
 * Nota: Con JWT, el logout es responsabilidad del cliente
 * (eliminar el token del localStorage/sessionStorage)
 */
router.post("/logout", controller.logout);

export default router;
