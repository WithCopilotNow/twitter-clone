import mongoose from "mongoose";
import { dbPostsSchema, postSchema, PostType } from "./post";
import { dbMediaSchema } from "./media";
import { dbUserSchema } from "./user";
import z from "zod/v4";

export const Comment: mongoose.Model<PostType> = mongoose.models.Comment || mongoose.model<PostType>("Comment", postSchema);

export const clientCommentSchema = z.object({
  title: z.string().nonempty().trim(),
  postId: z.string().refine(((val) => /^[0-9a-fA-F]{24}$/.test(val)), "invalid mongodb objectId hexString"),
  id: z.string().refine(((val) => /^[0-9a-fA-F]{24}$/.test(val)), "invalid mongodb objectId hexString").optional(),
  file: z.instanceof(File).refine((val) => {
    if(val.size === 0) return true;
    const {success} = z.file().min(1).max(1024 * 1024 * 3).mime(["image/jpeg", "image/png"]).safeParse(val);
    return success;
  }, "Invalid File instance.").optional()
})

export const dbCommentSchema = z.object({
    _id: z.instanceof(mongoose.Types.ObjectId),
    title: z.string().nonempty(),
    visibility: z.enum(["Everyone can reply", "Accounts you follow", "Verified accounts", "Only accounts you mention"]),
    media: dbMediaSchema,
    owner: dbUserSchema,
    likes: z.array(z.instanceof(mongoose.Types.ObjectId)),
    comments: dbPostsSchema,
    repostCount: z.number().nonnegative(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

export const dbDeCommentSchema = z.object({
    _id: z.instanceof(mongoose.Types.ObjectId),
    title: z.string().nonempty(),
    visibility: z.enum(["Everyone can reply", "Accounts you follow", "Verified accounts", "Only accounts you mention"]),
    media: dbMediaSchema,
    owner: dbUserSchema,
    likes: z.array(z.instanceof(mongoose.Types.ObjectId)),
    comments: z.array(z.instanceof(mongoose.Types.ObjectId)),
    repostCount: z.number().nonnegative(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

export type DbCommentType = z.infer<typeof dbCommentSchema>;
export const dbCommentsSchema = z.array(dbCommentSchema);