import "server-only";
import mongoose from "mongoose";
import { z } from "zod/v4";
import { postSchema, PostType } from "./post";
import { dbMediaSchema } from "./media";
import { dbUserSchema } from "./user";

export type CommentType = PostType; 

export const Comment: mongoose.Model<CommentType> =
  mongoose.models?.Comment || mongoose.model<CommentType>("Comment", postSchema);

export const clientCommentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long").trim(),
  postId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId").optional(),
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

export const dbCommentSchema = z.object({ 
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

export type DbCommentType = z.infer<typeof dbCommentSchema>;
export const dbCommentsSchema = z.array(dbCommentSchema);