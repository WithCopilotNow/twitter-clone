import "server-only";
import mongoose from "mongoose";
import { z } from "zod/v4";
import { dbUserSchema } from "./User";
import { dbMediaSchema, mediaSchema, MediaType } from "./Media";

export type PostType = {
  _id?: mongoose.Types.ObjectId;
  title: string;
  visibility: "Everyone can reply" | "Accounts you follow" | "Verified accounts" | "Only accounts you mention";
  owner: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  media?: MediaType;
  repostCount: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export const postSchema = new mongoose.Schema<PostType>(
  {
    title: { type: String, required: true, maxlength: 200 },
    visibility: {
      type: String,
      enum: ["Everyone can reply", "Accounts you follow", "Verified accounts", "Only accounts you mention"],
      required: true,
      default: "Everyone can reply",
    },
    media: mediaSchema,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: "Comment", default: [] },
    repostCount: { type: Number, default: 0 },
  },
  { timestamps: true, id: false, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

postSchema.pre("save", function (next) {
  this.likes = Array.from(new Set(this.likes.map((id) => id.toHexString()))).map(
    (id) => new mongoose.Types.ObjectId(id)
  );
  next();
});

export const Post: mongoose.Model<PostType> =
  mongoose.models?.Post || mongoose.model<PostType>("Post", postSchema);

export const clientPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long").trim(),
  visibility: z.enum(["Everyone can reply", "Accounts you follow", "Verified accounts", "Only accounts you mention"]),
  file: z
    .instanceof(File)
    .optional()
    .refine(
      (val) => {
        if (!val || val.size === 0) return true;
        return val.size <= 3 * 1024 * 1024 && ["image/jpeg", "image/png"].includes(val.type);
      },
      "File must be JPEG/PNG and under 3MB"
    ),
});

export const dbPostSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId).transform((val) => val.toHexString()),
  title: z.string().min(1, "Title is required"),
  visibility: z.enum(["Everyone can reply", "Accounts you follow", "Verified accounts", "Only accounts you mention"]),
  media: dbMediaSchema,
  owner: dbUserSchema,
  likes: z.array(z.instanceof(mongoose.Types.ObjectId)).transform((val) => val.map((id) => id.toHexString())),
  comments: z
    .array(z.instanceof(mongoose.Types.ObjectId))
    .transform((val) => val.map((id) => id.toHexString())),
  repostCount: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type DbPostType = z.infer<typeof dbPostSchema>;
export const dbPostsSchema = z.array(dbPostSchema);