import "server-only";
import mongoose from "mongoose";
import { z } from "zod/v4";
import { dbMediaSchema, mediaSchema, MediaType } from "./media";

export type UserType = {
  _id?: mongoose.Types.ObjectId;
  githubId: string;
  name: string;
  email: string;
  userId?: string;
  avatarUrl?: string;
  bgUrl?: MediaType;
  createdAt?: Date;
  updatedAt?: Date;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  postCount: number;
};

const userSchema = new mongoose.Schema<UserType>(
  {
    githubId: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, required: true, index: true },
    name: { type: String, required: true, maxlength: 100 },
    avatarUrl: { type: String },
    bgUrl: mediaSchema,
    followers: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    following: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    postCount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, id: false, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

userSchema.pre("save", function (next) {
  this.followers = Array.from(new Set(this.followers.map((id) => id.toHexString()))).map(
    (id) => new mongoose.Types.ObjectId(id)
  );
  this.following = Array.from(new Set(this.following.map((id) => id.toHexString()))).map(
    (id) => new mongoose.Types.ObjectId(id)
  );
  next();
});

userSchema.virtual("userId").get(function () {
  return this.email.split("@")[0];
});

export const User: mongoose.Model<UserType> = mongoose.models?.User || mongoose.model<UserType>("User", userSchema);

export const dbUserSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId).transform((val) => val.toHexString()),
  githubId: z.string().min(1, "GitHub ID is required"),
  email: z.string().email().max(255, "Email is too long"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  userId: z.string().min(1, "User ID is required"),
  avatarUrl: z.url().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  followers: z.array(z.instanceof(mongoose.Types.ObjectId)).default([]),
  following: z.array(z.instanceof(mongoose.Types.ObjectId)).default([]),
  postCount: z.number().int().nonnegative(),
  bgUrl: dbMediaSchema.optional(),
});

export type DbUserType = z.infer<typeof dbUserSchema>;
export const dbUsersSchema = z.array(dbUserSchema);