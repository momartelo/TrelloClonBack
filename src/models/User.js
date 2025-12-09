import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { publicPath } from "../../index.js";
import {
  isValidEmail,
  isValidPassword,
} from "../validations/user.validations.js";

const UserSchema = new Schema(
  {
    avatar: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["MASC", "FEM", "NO-BIN"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: isValidEmail,
        message: "El email no es válido",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: isValidPassword,
        message:
          "La contraseña no cumple los requisitos (mín 1 may., 1 min., 1 símbolo, 4 números, 8 caract.)",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// PRE-SAVE SEGURO (sin next())
UserSchema.pre("save", async function () {
  if (this.isModified("gender")) {
    if (this.gender === "MASC") this.avatar = "/img/avatar-hombre.png";
    else if (this.gender === "FEM") this.avatar = "/img/avatar-mujer.png";
    else this.avatar = "/img/avatar-no-binario.png";
  }

  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

export const UserModel = model("User", UserSchema);
