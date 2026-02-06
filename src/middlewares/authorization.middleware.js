import passport from "passport";

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      error: "Acceso denegado. Solo administradores.",
      userRole: req.user?.role || "no autenticado"
    });
  }
  next();
};

export const requireUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({
      status: "error",
      error: "Acceso denegado. Solo usuarios.",
      userRole: req.user?.role || "no autenticado"
    });
  }
  next();
};

