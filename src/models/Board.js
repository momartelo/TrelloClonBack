import { Schema, model, Types } from "mongoose";

const BoardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    favorite: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const BoardModel = model("Board", BoardSchema);
