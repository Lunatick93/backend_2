import passport from "passport";

export const authenticateLocal = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: info?.message || "Autenticación fallida" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: info?.message || "Token inválido o expirado" });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const getCurrent = (req, res, next) => {
  passport.authenticate("current", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: info?.message || "Usuario no autenticado" });
    }
    req.user = user;
    next();
  })(req, res, next);
};
