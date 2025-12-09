import jwt from "jsonwebtoken";
import { config } from "../settings/config.js";

export const createJWT = async (payload) => {
  return new Promise((res, rej) => {
    jwt.sign(payload, config.jwt_secret, { expiresIn: "1h" }, (err, token) => {
      if (err) return rej(err);
      res(token);
    });
  });
};

export const verifyJWT = async (token) => {
  return new Promise((res, rej) => {
    jwt.verify(token, config.jwt_secret, (err, decoded) => {
      if (err) return rej("Token inválido o expirado");
      res(decoded);
    });
  });
};
