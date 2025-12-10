import { verifyJWT } from "../utils/jwt.js";

export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ error: "Falta token de autenticación" });

  const token = header.split(" ")[1]; // "Bearer TOKEN"
  try {
    const decoded = await verifyJWT(token);
    console.log("👉 TOKEN DECODED:", decoded); // <--- AQUÍ
    req.user = decoded; // disponible en controladores
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
};
