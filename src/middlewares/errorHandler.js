/**
 * Middleware para manejo centralizado de errores
 */

export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${err.message}`);

  // Errores de validación
  if (err.message.includes("Campos obligatorios") || 
      err.message.includes("debe ser") ||
      err.message.includes("no puede") ||
      err.message.includes("inválido") ||
      err.message.includes("ID de MongoDB")) {
    return res.status(400).json({
      status: "error",
      error: err.message
    });
  }

  // Errores de no encontrado
  if (err.message.includes("no encontrado")) {
    return res.status(404).json({
      status: "error",
      error: err.message
    });
  }

  // Errores de duplicación (código único)
  if (err.message.includes("ya existe")) {
    return res.status(409).json({
      status: "error",
      error: err.message
    });
  }

  // Errores de base de datos Mongoose
  if (err.name === "MongoServerError" && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      status: "error",
      error: `El ${field} ya existe`
    });
  }

  // Error genérico
  res.status(500).json({
    status: "error",
    error: "Error interno del servidor"
  });
}

/**
 * Wrapper para capturar errores en rutas async
 */
export function catchAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
