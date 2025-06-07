import "server-only"
import mongoose from "mongoose";
import { z } from "zod/v4";
import { dbMediaSchema, mediaSchema } from "./media";

export type UserType = {
  _id?: mongoose.Types.ObjectId,
  githubId: string,
  name: string,
  email: string,
  userId?: string,
  avatarUrl?: string,
  bgUrl?: string,
  createdAt?: Date,
  updatedAt?: Date,
  followers: mongoose.Types.ObjectId[],
  following: mongoose.Types.ObjectId[],
  postCount: number
}

const userSchema = new mongoose.Schema<UserType>({
  githubId: { type: mongoose.Schema.Types.String, unique: true, required: true },
  email: { type: mongoose.Schema.Types.String, unique: true, required: true },
  name: { type: mongoose.Schema.Types.String, required: true },
  avatarUrl: { type: mongoose.Schema.Types.String },
  bgUrl: mediaSchema,
  followers: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  following: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  postCount: {type: mongoose.Schema.Types.Number, required: true, default: 0}
}, {timestamps: true, id: false});

userSchema.pre("save", function(next){
    this.followers = [...new Set(this.followers)];
    this.following = [...new Set(this.following)];
    next()
})

userSchema.virtual("userId").get(function(){
  return this.email.split("@")[0];
})

export const User: mongoose.Model<UserType> = mongoose.models.User || mongoose.model<UserType>("User", userSchema);

export const dbUserSchema = z.object({
    _id: z.instanceof(mongoose.Types.ObjectId).transform((val) => val.toHexString()),
    githubId: z.string().nonempty(),
    name: z.string().nonempty(),
    userId: z.string().nonempty(),
    email: z.email(),
    avatarUrl: z.url().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    followers: z.array(z.instanceof(mongoose.Types.ObjectId)),
    following: z.array(z.instanceof(mongoose.Types.ObjectId)),
    postCount: z.number().positive(),
    bgUrl: dbMediaSchema,
})

export type DbUserType = z.infer<typeof dbUserSchema>;

export const dbUsersSchema = z.array(dbUserSchema);

