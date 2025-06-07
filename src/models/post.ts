import "server-only"
import mongoose from "mongoose";
import { z } from "zod/v4";
import { dbUserSchema } from "./user";
import { dbMediaSchema, mediaSchema, MediaType } from "./media";


export type PostType = {
    _id?: mongoose.Types.ObjectId,
    title: string,
    visibility: "Everyone can reply" | "Accounts you follow" | "Verified accounts" | "Only accounts you mention",
    owner: mongoose.Types.ObjectId,
    likes: mongoose.Types.ObjectId[],
    comments: mongoose.Types.ObjectId[],
    media?: MediaType,
    repostCount: number,
    createdAt?: Date,
    updatedAt?: Date
}

export const postSchema = new mongoose.Schema<PostType>({
    title: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    visibility: {
        type: mongoose.Schema.Types.String,
        required: true,
        default: "Everyone can reply"
    },
    media: mediaSchema,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Comment",
        default: []
    },
    repostCount: {
        type: mongoose.Schema.Types.Number,
        default: 0
    },
}, {timestamps: true, id: false})

postSchema.pre("save", function(next){
    this.likes = [...new Set(this.likes)];
    next()
})

export const Post: mongoose.Model<PostType> = mongoose.models?.Post || mongoose.model<PostType>("Post", postSchema);

export const clientPostSchema = z.object({
  title: z.string().nonempty().trim(),
  visibility: z.enum(["Everyone can reply", "Accounts you follow", "Verified accounts", "Only accounts you mention"]),
  file: z.instanceof(File).refine((val) => {
    if(val.size === 0) return true;
    const {success} = z.file().min(1).max(1024 * 1024 * 3).mime(["image/jpeg", "image/png"]).safeParse(val);
    return success;
  }, "Invalid File instance.")
})



export const dbPostSchema = z.object({
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

export type DbPostType = z.infer<typeof dbPostSchema>;
export const dbPostsSchema = z.array(dbPostSchema);


