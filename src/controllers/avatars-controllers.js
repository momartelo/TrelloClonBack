import fs from "fs";
import { publicPath } from "../../index.js";

export const ctrlListAllAvatars = async (req, res) => {
  const avatarDir = path.join(publicPath, avatars);

  fs.readdir(avatarDir, (err, files) => {
    if (err) {
      console.log("Error al leer directorio de avatares:", err);
      return res
        .status(500)
        .json({ message: "Error interno al obtener avatares" });
    }
    const avatares = files.map((file) => `/img/${file}`);
    res.json(avatares);
  });
};
