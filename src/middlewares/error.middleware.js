// Middleware global de manejo de errores
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error capturado:", err.stack || err);

  res.status(err.status || 500).json({
    error: err.message || "Ocurrió un error en el servidor",
  });
};
