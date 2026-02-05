import passport from "passport";

/**
 * MIDDLEWARE: authenticateLocal
 * Valida credenciales (email + password) usando Passport Strategy Local
 * Compara con la base de datos y valida la contraseña con bcrypt
 */
export const authenticateLocal = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // Error del servidor
    if (err) {
      return res.status(500).json({ 
        status: "error",
        error: "Error interno del servidor",
        details: err.message 
      });
    }

    // Usuario no autenticado (credenciales inválidas)
    if (!user) {
      return res.status(401).json({ 
        status: "error",
        error: info?.message || "Credenciales inválidas" 
      });
    }

    // Usuario autenticado correctamente
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * MIDDLEWARE: authenticateJWT
 * Valida JWT usando Passport Strategy JWT
 * Se usa para proteger rutas que requieren token válido
 */
export const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    // Error del servidor
    if (err) {
      return res.status(500).json({ 
        status: "error",
        error: "Error interno del servidor",
        details: err.message 
      });
    }

    // Token inválido o expirado
    if (!user) {
      return res.status(401).json({ 
        status: "error",
        error: info?.message || "Token inválido o expirado" 
      });
    }

    // Token válido
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * MIDDLEWARE: getCurrent
 * ESTRATEGIA PASSPORT "CURRENT" PARA VALIDAR USUARIO LOGUEADO
 * 
 * Este middleware:
 * 1. Extrae el JWT del header Authorization: Bearer {token}
 * 2. Valida la firma del token con JWT_SECRET
 * 3. Busca el usuario en la base de datos por su ID
 * 4. Devuelve los datos del usuario actualizado de la BD
 * 5. Devuelve 401 si el token es inválido o no existe
 */
export const getCurrent = (req, res, next) => {
  // Usar passport.authenticate("current") de forma explícita
  passport.authenticate("current", (err, user, info) => {
    // Error del servidor
    if (err) {
      return res.status(401).json({ 
        status: "error",
        error: "Token inválido",
        details: err.message 
      });
    }

    // Token ausente o inválido
    if (!user) {
      return res.status(401).json({ 
        status: "error",
        error: info?.message || "Usuario no autenticado",
        message: "Debe enviar un token JWT válido en el header Authorization"
      });
    }

    // Token válido, usuario encontrado en BD
    req.user = user;
    next();
  })(req, res, next);
};
