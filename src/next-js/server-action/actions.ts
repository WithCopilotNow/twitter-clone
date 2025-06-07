"use server"

import "server-only";
import { auth, signIn, signOut } from "@/auth";
import { connectToDatabase, } from "@/lib/db";
import { dbUserSchema, dbUsersSchema, DbUserType, User } from "@/models/user";
import { clientPostSchema, dbPostSchema, dbPostsSchema, DbPostType, Post, PostType } from "@/models/post";
import { redirect } from "next/navigation";
import { randomUUID, UUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import mongoose from "mongoose";
import type { User as SessionUser } from "next-auth";
import { clientCommentSchema, dbCommentSchema, DbCommentType, dbDeCommentSchema } from "@/models/comment";
import { Comment } from "@/models/comment";

export const getUniqueId = async (): Promise<UUID> => randomUUID();
export const loginAction = async (): Promise<void> => { await signIn("github") };
export const logoutAction = async (): Promise<void> => {
    try {
         await signOut({redirectTo: "/login"});
    } catch (err) {
        console.log(err);
        throw err;
    }
};

async function isAuthorized(): Promise<SessionUser> {
    const session = await auth();
    if(!session || !session.user) return redirect("/login");
    await connectToDatabase();
    return session.user;
}

const searchQuerySchema = z.string().toLowerCase().trim();
export const searchAction = async (prevState: DbUserType[], formData: FormData): Promise<DbUserType[]> => {
    try {
        await isAuthorized();
        const query = searchQuerySchema.parse(formData.get("search"));
        if(!query) return [];
        const dbUsers = await User.find({name: {$regex: query, $options: "i"}});
        if(dbUsers.length < 1) return [];
        const users = dbUsersSchema.parse(dbUsers);
        return users;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const createPostAction = async (formData: FormData): Promise<void> => {
    try {
        const user = await isAuthorized()
        const dbUser = await User.findOne({githubId: user.id});
        if(!dbUser) throw new Error("User not found");
        const parsedUser = dbUserSchema.parse(dbUser);
        const clientPost = Object.fromEntries(formData);
        const parsedPost = clientPostSchema.parse(clientPost)
        const postData: Pick<PostType, "owner" | "title" | "visibility" | "media"> = {
            owner: new mongoose.Types.ObjectId(parsedUser._id), 
            title: parsedPost.title,
            visibility: parsedPost.visibility,
        }
        if(parsedPost.file.size > 0){
            const buffer = Buffer.from(await parsedPost.file.arrayBuffer());
            postData.media = {
                size: parsedPost.file.size,
                mimeType: parsedPost.file.type,
                mediaName: parsedPost.file.name,
                source: buffer.toString("base64")
            }
        }
        await Post.create(postData);
        dbUser.postCount++;
        await dbUser.save()
        revalidatePath("/home")
    } catch (err) {
        console.error(`Error while composing post: ${err}`);
        throw err;
    }
}

export const getPosts = async (): Promise<DbPostType[]> => {
    try {
        await isAuthorized()
        const dbPosts = await Post.find().populate("owner");
        const parsedPosts = dbPostsSchema.parse(dbPosts);
        return parsedPosts;
    } catch (err) {
        console.error("Error while getting posts from the database.", err)
        throw err;
    }
}

const likeActionSchema = z.object({
    likePost: z.enum(["true", "false"]),
    id: z.string().refine((val) => /^[0-9a-fA-f]{24}$/.test(val), "invalid postId")
})

export async function postLikeAction(formData: FormData): Promise<void> {
    try {
        const user = await isAuthorized();
        const dbUser = await User.findOne({githubId: user.id});
        if(!dbUser) throw new Error("User not found");
        const parsedUser = dbUserSchema.parse(dbUser);
        const parsedLikeData = likeActionSchema.parse(Object.fromEntries(formData));
        const postId = new mongoose.Types.ObjectId(parsedLikeData.id);
        const dbPost = await Post.findOne({_id: postId}).populate("owner");
        if(!dbPost) throw new Error("Post not found");
        const parsedPost = dbPostSchema.parse(dbPost);
        if(parsedLikeData.likePost === "true"){
            dbPost.likes.push(new mongoose.Types.ObjectId(parsedUser._id));
            await dbPost.save();
            return;
        }
        dbPost.likes = parsedPost.likes.filter((like) => like.toHexString() != parsedUser._id);
        await dbPost.save();
        revalidatePath(`/post/${parsedPost._id.toHexString()}`);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function bookmarkPostAction() {}

type GetUserProps = {
    email: string
}

export async function getUser({email}: GetUserProps): Promise<DbUserType> {
    try {
        await isAuthorized();
        const dbUser = await User.findOne({email});
        if(!dbUser) throw new Error("User not found.");
        const parsedUser = dbUserSchema.parse(dbUser);
        return parsedUser;
    } catch (err) {
        console.log(`Error while getting the User from the server: ${err}`);
        throw err;
    }
}

type GetUserPostsProps = {
    email: string
}

export async function getUserPosts({email}: GetUserPostsProps): Promise<DbPostType[]> {
    try {
        await isAuthorized();
        const dbUser = await User.findOne({email});
        if(!dbUser) throw new Error("User not found.");
        const dbPosts = await Post.find({owner: dbUser._id}).sort({createdAt: -1}).populate("owner");
        if(dbPosts.length === 0) return [];
        const parsedPosts = dbPostsSchema.parse(dbPosts);
        return parsedPosts;
    } catch (err) {
        console.log(`Error while featching user posts: ${err}`);
        throw err
    }
}

export async function getPost(postId: string): Promise<DbPostType> {
    try {
        await isAuthorized();
        const dbPostComment = await Post.findOne({_id: new mongoose.Types.ObjectId(postId)}).populate("owner");
        if(!dbPostComment) throw new Error("Post not found.")
        const parsedPost = dbPostSchema.parse(dbPostComment);
        return parsedPost;
    } catch (err) {
        console.log(`Error while getting a post: ${err}`);
        throw err;
    }
};


export async function createCommentAction(formData: FormData): Promise<void> {
    try {
        const user = await isAuthorized()
        const dbUser = await User.findOne({githubId: user.id});
        if(!dbUser) throw new Error("User not found");
        const parsedUser = dbUserSchema.parse(dbUser);
        const clientCommentData = Object.fromEntries(formData);
        const parsedClientCommentData = clientCommentSchema.parse(clientCommentData);
        const dbPost = await Post.findOne({_id: new mongoose.Types.ObjectId(parsedClientCommentData.postId)}).populate("owner");
        if(!dbPost) throw new Error("Post not found.");
        const parsedPost = dbPostSchema.parse(dbPost);
        const commentData: Pick<PostType, "owner" | "title" | "media"> = {
            owner: new mongoose.Types.ObjectId(parsedUser._id), 
            title: parsedClientCommentData.title,
        }
        if(parsedClientCommentData.file && parsedClientCommentData.file.size > 0){
            const buffer = Buffer.from(await parsedClientCommentData.file.arrayBuffer());
            commentData.media = {
                size: parsedClientCommentData.file.size,
                mimeType: parsedClientCommentData.file.type,
                mediaName: parsedClientCommentData.file.name,
                source: buffer.toString("base64")
            }
        }
        const comment = await Comment.create(commentData);
        dbPost.comments.push(comment._id);
        dbPost.save();
        revalidatePath(`/post/${parsedPost._id.toHexString()}`);
    } catch (err) {
        console.log(`Error while composing comment: ${err}`);
        throw err;
    }
}


export async function getPostComments(postId: string): Promise<DbCommentType> {
    try {
        await isAuthorized();
        const dbPostCommet = await Post.findOne({_id: new mongoose.Types.ObjectId(postId)}).populate([{ path: "owner" }, { path: "comments", populate: { path: "owner" }, }]);
        if(!dbPostCommet) throw new Error("Post not found.")
        const parsedPostComment = dbCommentSchema.parse(dbPostCommet);
        return parsedPostComment;
    } catch (err) {
        console.log(`Error while getting a post: ${err}`);
        throw err;
    }
}


export async function getCommentComments(commentId: string): Promise<DbCommentType> {
    try {
        await isAuthorized();
        const dbCommet = await Comment.findOne({_id: new mongoose.Types.ObjectId(commentId)}).populate([{ path: "owner" }, { path: "comments", populate: { path: "owner" }, }]);
        if(!dbCommet) throw new Error("Comment not found.")
        const parsedComment = dbCommentSchema.parse(dbCommet);
        return parsedComment;
    } catch (err) {
        console.log(`Error while getting a post: ${err}`);
        throw err;
    }
}


export async function commentLikeAction(formData: FormData): Promise<void> {
    try {
        const user = await isAuthorized();
        const dbUser = await User.findOne({githubId: user.id});
        if(!dbUser) throw new Error("User not found");
        const parsedUser = dbUserSchema.parse(dbUser);
        const parsedLikeData = likeActionSchema.parse(Object.fromEntries(formData));
        const dbComment = await Comment.findOne({_id: new mongoose.Types.ObjectId(parsedLikeData.id)}).populate("owner");
        if(!dbComment) throw new Error("Comment post not found.");
        dbDeCommentSchema.parse(dbComment);
        if(parsedLikeData.likePost === "true"){
            dbComment.likes.push(new mongoose.Types.ObjectId(parsedUser._id));
            await dbComment.save();
            return;
        }
        dbComment.likes = dbComment.likes.filter((like) => like.toHexString() != parsedUser._id);
        await dbComment.save();
    } catch (err) {
        console.log(err)
        throw err;
    }
}


export async function createCominCom(formData: FormData): Promise<void> {
    try {
        const user = await isAuthorized()
        const dbUser = await User.findOne({githubId: user.id});
        if(!dbUser) throw new Error("User not found");
        const parsedUser = dbUserSchema.parse(dbUser);
        const clientComment = Object.fromEntries(formData);
        const parsedClientCommentData = clientCommentSchema.parse(clientComment);
        const dbPostComment = await Comment.findOne({_id: new mongoose.Types.ObjectId(parsedClientCommentData.postId)}).populate("owner");
        if(!dbPostComment) throw new Error("Comment not found.");
        dbDeCommentSchema.parse(dbPostComment);
        const commentData: Pick<PostType, "owner" | "title" | "media"> = {
            owner: new mongoose.Types.ObjectId(parsedUser._id), 
            title: parsedClientCommentData.title,
        }
        if(parsedClientCommentData.file && parsedClientCommentData.file.size > 0){
            const buffer = Buffer.from(await parsedClientCommentData.file.arrayBuffer());
            commentData.media = {
                size: parsedClientCommentData.file.size,
                mimeType: parsedClientCommentData.file.type,
                mediaName: parsedClientCommentData.file.name,
                source: buffer.toString("base64")
            }
        }
        const comment = await Comment.create(commentData);
        dbPostComment.comments.push(comment._id);
        dbPostComment.save();
        revalidatePath(`/posts/${parsedClientCommentData.id}/comments/${parsedClientCommentData.postId}`)
    } catch (err) {
        console.log(`Error while composing comment: ${err}`);
        throw err;
    }
}

export async function getUserId(): Promise<string> {
    try {
        const user = await isAuthorized();
        const dbUser = await User.findOne({githubId: user.id});
        if(!dbUser) throw new Error("User not found");
        const parsedUser = dbUserSchema.parse(dbUser);
        return parsedUser._id;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
