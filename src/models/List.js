import { Schema, model, Types } from "mongoose";

const ListSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    board: {
      type: Types.ObjectId,
      ref: "Board",
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ListModel = model("List", ListSchema);
