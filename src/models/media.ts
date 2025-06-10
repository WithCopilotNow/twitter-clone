import "server-only";
import mongoose from "mongoose";
import { z } from "zod/v4";

export type MediaType = {
  _id?: mongoose.Types.ObjectId;
  source: string;
  size: number;
  mimeType: string;
  mediaName: string;
  lastModified?: Date;
  dataUrl?: string;
};

export const mediaSchema = new mongoose.Schema<MediaType>(
  {
    source: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    mediaName: { type: String, required: true },
    lastModified: { type: Date, required: true, default: Date.now },
  },
  { id: false, _id: false, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

mediaSchema.virtual("dataUrl").get(function () {
  return `data:${this.mimeType};base64,${this.source}`;
});

export const dbMediaSchema = z
  .object({
    source: z.base64("Media source must be valid base64"),
    size: z.number().positive().max(3 * 1024 * 1024, "Media size must be under 3MB"),
    mimeType: z.enum(["image/png", "image/jpeg"], { message: "Media must be PNG or JPEG" }),
    mediaName: z.string().min(1, "Media name is required"),
    lastModified: z.coerce.date(),
    dataUrl: z.string(),
  })
  .optional();

export type DbMediaType = z.infer<typeof dbMediaSchema>;