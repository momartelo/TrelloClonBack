export const allowOnly = (allowedFields = []) => {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== "object") return next();

    const originalKeys = Object.keys(req.body);
    const filtered = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) filtered[key] = req.body[key];
    }

    // Reemplaza body por uno seguro
    req.body = filtered;

    next();
  };
};
