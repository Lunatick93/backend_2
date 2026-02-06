import passport from "passport";

export const authenticateLocal = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // error del servidor
    if (err) {
      return res.status(500).json({ 
        status: "error",
        error: "Error interno del servidor",
        details: err.message 
      });
    }


    if (!user) {
      return res.status(401).json({ 
        status: "error",
        error: info?.message || "Credenciales inválidas" 
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    // error del servidor
    if (err) {
      return res.status(500).json({ 
        status: "error",
        error: "Error interno del servidor",
        details: err.message 
      });
    }

    // token invalido o expirado
    if (!user) {
      return res.status(401).json({ 
        status: "error",
        error: info?.message || "Token inválido o expirado" 
      });
    }

    // token valido
    req.user = user;
    next();
  })(req, res, next);
};


export const getCurrent = (req, res, next) => {
  passport.authenticate("current", (err, user, info) => {
    // error del servidor (sugerencia del profe con el manejo de errores)
    if (err) {
      return res.status(401).json({ 
        status: "error",
        error: "Token inválido",
        details: err.message 
      });
    }

    // token ausente o invalido
    if (!user) {
      return res.status(401).json({ 
        status: "error",
        error: info?.message || "Usuario no autenticado",
        message: "Debe enviar un token JWT válido en el header Authorization"
      });
    }

    // token valido, usuario encontrado en BD
    req.user = user;
    next();
  })(req, res, next);
};
