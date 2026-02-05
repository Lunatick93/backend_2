import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import Cart from "../models/cart.model.js";
import { catchAsync } from "../middlewares/errorHandler.js";

/**
 * ENDPOINT: POST /api/sessions/register
 * 
 * PROPÓSITO: Registrar un nuevo usuario en el sistema
 * 
 * CAMPOS REQUERIDOS (según consigna):
 * - first_name: String
 * - last_name: String
 * - email: String (debe ser único)
 * - age: Number
 * - password: String (se encriptará con bcrypt.hashSync antes de guardar)
 * 
 * PROCESO:
 * 1. Valida que todos los campos estén presentes
 * 2. Valida tipos de datos
 * 3. Verifica que el email sea único
 * 4. Crea un carrito automáticamente
 * 5. Crea el usuario (password se encripta en pre-save del modelo)
 * 6. Genera JWT válido por 24 horas
 * 7. Devuelve token + datos del usuario (sin contraseña)
 * 
 * RESPUESTA (201):
 * {
 *   "message": "Usuario registrado exitosamente",
 *   "token": "eyJhbGciOi...",
 *   "user": { ... }
 * }
 */
export const register = catchAsync(async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).json({
      error: "Todos los campos son obligatorios (first_name, last_name, email, age, password)"
    });
  }

  if (typeof age !== "number" || age < 1) {
    return res.status(400).json({ error: "La edad debe ser un número mayor a 0" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ error: "El email ya está registrado" });
  }

  const cart = await Cart.create({ products: [] });

  const newUser = new User({
    first_name,
    last_name,
    email: email.toLowerCase(),
    age,
    password,  // Se encriptará automáticamente en pre-save del modelo con bcrypt.hashSync
    cart: cart._id
  });

  await newUser.save();

  const token = generateToken(newUser);

  res.status(201).json({
    message: "Usuario registrado exitosamente",
    token,
    user: newUser.toJSON()
  });
});

/**
 * ENDPOINT: POST /api/sessions/login
 * 
 * PROPÓSITO: Autenticar usuario y generar JWT
 * 
 * FLUJO:
 * 1. Middleware authenticateLocal valida email + password
 * 2. Busca usuario en BD por email
 * 3. Compara password ingresado con hash en BD usando bcrypt.compareSync()
 * 4. Si credenciales son correctas → Genera JWT
 * 5. Si credenciales son incorrectas → Error 401
 * 
 * RESPUESTA (200):
 * {
 *   "message": "Login exitoso",
 *   "token": "eyJhbGciOi...",
 *   "user": { ... }
 * }
 */
export const login = catchAsync(async (req, res) => {
  // req.user ya fue autenticado por middleware authenticateLocal
  // Credenciales validadas correctamente
  const token = generateToken(req.user);

  res.json({
    message: "Login exitoso",
    token,
    user: req.user.toJSON()
  });
});

/**
 * ENDPOINT: GET /api/sessions/current
 * 
 * PROPÓSITO: Validar al usuario logueado contra la base de datos
 * 
 * FLUJO:
 * 1. El middleware getCurrent valida el JWT usando Passport "current"
 * 2. Passport extrae el token del header Authorization: Bearer {token}
 * 3. Valida la firma del token con JWT_SECRET
 * 4. Busca el usuario en la BD por payload.id
 * 5. Si el usuario no existe en BD → Error 401
 * 6. Si el token es inválido/expirado → Error 401
 * 7. Si todo es válido → Devuelve datos del usuario actualizado de la BD
 * 
 * RESPUESTA EXITOSA (200):
 * {
 *   "user": {
 *     "_id": "...",
 *     "first_name": "Enzo",
 *     "last_name": "Perez",
 *     "email": "enzito@example.com",
 *     "age": 25,
 *     "role": "user",
 *     "cart": "..."
 *   }
 * }
 * 
 * ERRORES:
 * - 401: Sin token, token inválido, token expirado, usuario no existe en BD
 */
export const current = catchAsync(async (req, res) => {
  // req.user ya fue validado por el middleware getCurrent usando Passport "current"
  // Esto garantiza que:
  // 1. El JWT es válido
  // 2. El usuario existe en la base de datos
  // 3. El usuario está autenticado correctamente

  res.json({
    status: "success",
    message: "Usuario autenticado correctamente",
    user: req.user.toJSON()  // Devuelve usuario sin contraseña
  });
});

export const logout = catchAsync(async (req, res) => {
  res.json({ message: "Logout exitoso" });
});
