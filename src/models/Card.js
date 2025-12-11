import { Schema, model, Types } from "mongoose";

const CardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    list: {
      type: Types.ObjectId,
      ref: "List",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const CardModel = model("Card", CardSchema);
