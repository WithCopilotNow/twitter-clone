"use server"

import "server-only";
import { auth, signIn, signOut } from "@/auth";
import { dbUserSchema, dbUsersSchema, DbUserType, User } from "../../models/User";
import { clientPostSchema, dbPostSchema, dbPostsSchema, DbPostType, Post, PostType } from "../../models/Post";
import { redirect } from "next/navigation";
import { randomUUID, UUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { clientCommentSchema, CommentType, dbCommentSchema, dbCommentsSchema, DbCommentType } from "../../models/Comment";
import { Comment } from "@/models/Comment";
import mongoose from "mongoose";
import { dbInit } from "@/lib/dbInit";
import { z } from "zod/v4";


dbInit().catch((err) => console.error('Failed to initialize database:', err));
export const getUniqueId = async (): Promise<UUID> => randomUUID();
export const loginAction = async (): Promise<void> => await signIn("github");
export const logoutAction = async (): Promise<void> => await signOut({redirectTo: "/login"});

const searchQuerySchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(100, "Search query is too long");

export async function searchAction(
  prevState: DbUserType[],
  formData: FormData
): Promise<DbUserType[]> {
  try {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const query = searchQuerySchema.parse(formData.get('search'));
    const dbUsers = await User.find({ name: { $regex: query, $options: 'i' } });

    return dbUsersSchema.parse(dbUsers.map((user) => user.toObject()));
  } catch (error) {
    console.error('Search action failed:', error);
    throw new Error('Failed to search users');
  }
}




export async function createPostAction(formData: FormData): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user) return redirect('/login');

    const parsedPost = clientPostSchema.parse(Object.fromEntries(formData));

    const dbUser = await User.findOneAndUpdate(
      { githubId: session.user.id },
      { $inc: { postCount: 1 } },
      { new: true }
    );

    if (!dbUser) throw new Error('User not found');
    const parsedUser = dbUserSchema.parse(dbUser.toObject());

    const postData: Pick<PostType, 'owner' | 'title' | 'visibility' | 'media'> = {
      owner: new mongoose.Types.ObjectId(parsedUser._id),
      title: parsedPost.title,
      visibility: parsedPost.visibility,
    };

    if (parsedPost.file && parsedPost.file.size > 0) {
      const buffer = Buffer.from(await parsedPost.file.arrayBuffer());
      postData.media = {
        size: parsedPost.file.size,
        mimeType: parsedPost.file.type,
        mediaName: parsedPost.file.name,
        source: buffer.toString('base64'),
        lastModified: new Date(),
      };
    }

    await Post.create(postData);

    revalidatePath('/home');
    revalidatePath(`/${parsedUser.userId}`);
  } catch (error) {
    console.error('Failed to create post:', error);
    throw new Error('Failed to create post');
  }
}





export async function getPosts(): Promise<DbPostType[]> {
  try {
    const session = await auth();
    if (!session?.user) return redirect('/login');

    const dbUser = await User.findOne({ githubId: session.user.id }, 'following').lean();
    if (!dbUser) throw new Error('User not found');

    const dbPosts = await Post.find({
      $or: [
        { visibility: 'Everyone can reply' }, 
        { owner: { $in: dbUser.following || [] } }, 
      ],
    })
      .populate({ path: 'owner', })
      .sort({ createdAt: -1 }) 
      .limit(20);

    return dbPosts.length ? dbPosts.map((post) => dbPostSchema.parse(post.toObject())) : [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw new Error('Failed to fetch posts');
  }
}





const likeActionSchema = z.object({
  likeStatus: z.enum(['like', 'unlike']),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID'),
});

export async function postLikeAction(formData: FormData): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const dbUser = await User.findOne({ githubId: session.user.id });
    if (!dbUser) throw new Error('User not found');
    const parsedUser = dbUserSchema.parse(dbUser.toObject());

    const parsedLikeData = likeActionSchema.parse(Object.fromEntries(formData));

    const postId = new mongoose.Types.ObjectId(parsedLikeData.id);
    const userId = new mongoose.Types.ObjectId(parsedUser._id);
    const update = parsedLikeData.likeStatus === 'like'
      ? { $addToSet: { likes: userId } } 
      : { $pull: { likes: userId } };

    const dbPost = await Post.findByIdAndUpdate(postId, update, { new: true });
    if (!dbPost) throw new Error('Post not found');

    revalidatePath('/home');
    revalidatePath(`/post/${parsedLikeData.id}`);
  } catch (error) {
    console.error('Failed to update post like:', error);
    throw new Error('Failed to like/unlike post');
  }
}




export async function bookmarkPostAction() {}

const getUserPropsSchema = z.object({
  email: z.email().max(255, 'Email is too long'),
});

export async function getUser({ email }: { email: string }): Promise<DbUserType> {
  try {
    const validatedProps = getUserPropsSchema.parse({ email });

    const session = await auth();
    if (!session?.user) return redirect('/login');

    const dbUser = await User.findOne({ email: validatedProps.email });
    if (!dbUser) throw new Error('User not found');

    return dbUserSchema.parse(dbUser.toObject());
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user');
  }
}





const getUserPostsPropsSchema = z.object({
  email: z.email().max(255, 'Email is too long'),
});

export async function getUserPosts({ email }: { email: string }): Promise<DbPostType[]> {
  try {
    const validatedProps = getUserPostsPropsSchema.parse({ email });

    const session = await auth();
    if (!session?.user) return redirect('/login');

    const dbUser = await User.findOne({ email: validatedProps.email }).lean();
    if (!dbUser) throw new Error('User not found');

    const dbPosts = await Post.find({ owner: dbUser._id })
      .sort({ createdAt: -1 })
      .populate({ path: 'owner', })
      .limit(20)

    return dbPostsSchema.parse(dbPosts.map((post) => post.toObject()));
  } catch (error) {
    console.error('Failed to fetch user posts:', error);
    throw new Error('Failed to fetch user posts');
  }
}




const getPostPropsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID'),
});

export async function getPost({ id }: { id: string }): Promise<DbPostType> {
  try {
    const validatedProps = getPostPropsSchema.parse({ id });

    const session = await auth();
    if (!session?.user) return redirect('/login');

    const postId = new mongoose.Types.ObjectId(validatedProps.id);
    const dbPost = await Post.findById(postId)
      .populate({ path: "owner", })
    if (!dbPost) throw new Error('Post not found');

    return dbPostSchema.parse(dbPost.toObject());
  } catch (error) {
    console.error('Failed to fetch post:', error);
    throw new Error('Failed to fetch post');
  }
}






export async function createCommentAction(formData: FormData): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user) return redirect('/login');

    const dbUser = await User.findOne({ githubId: session.user.id });
    if (!dbUser) throw new Error('User not found');
    const parsedUser = dbUserSchema.parse(dbUser.toObject());

    const parsedComment = clientCommentSchema.parse(Object.fromEntries(formData));

    const postId = new mongoose.Types.ObjectId(parsedComment.postId);
    const dbPost = await Post.findById(postId).lean();
    if (!dbPost) throw new Error('Post not found');

    const commentData: Pick<CommentType, 'owner' | 'title' | 'visibility' | 'media'> = {
      owner: new mongoose.Types.ObjectId(parsedUser._id),
      title: parsedComment.title,
      visibility: dbPost.visibility,
    };

    if (parsedComment.file && parsedComment.file.size > 0) {
      const buffer = Buffer.from(await parsedComment.file.arrayBuffer());
      commentData.media = {
        size: parsedComment.file.size,
        mimeType: parsedComment.file.type,
        mediaName: parsedComment.file.name,
        source: buffer.toString('base64'),
        lastModified: new Date(),
      };
    }

    const newComment = await Comment.create(commentData);
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } }, { new: true });

    revalidatePath(`/home`);
    revalidatePath(`/post/${parsedComment.postId}`);
  } catch (error) {
    console.error('Failed to create comment:', error);
    throw new Error('Failed to create comment');
  }
}





const getCommentsPropsSchema = z.object({
  postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID'),
});

export async function getComments({ postId }: { postId: string }): Promise<DbCommentType[]> {
  try {
    const validatedProps = getCommentsPropsSchema.parse({ postId });

    const session = await auth();
    if (!session?.user) return redirect('/login');

    const id = new mongoose.Types.ObjectId(validatedProps.postId);
    const dbPost = await Post.findById(id).lean();
    if (!dbPost) throw new Error('Post not found');

    const dbComments = await Comment.find({ _id: { $in: dbPost.comments } })
      .populate({ path: 'owner', })
      .sort({ createdAt: -1 }) 
      .limit(20) 

    return dbComments.length ? dbCommentsSchema.parse(dbComments.map((comment) => comment.toObject())) : [];
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw new Error('Failed to fetch comments');
  }
}






const getCommentCommentsPropsSchema = z.object({
  commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid comment ID'),
});

export async function getCommentComments({ commentId }: { commentId: string }): Promise<DbCommentType[]> {
  try {
    const validatedProps = getCommentCommentsPropsSchema.parse({ commentId });

    const session = await auth();
    if (!session?.user) return redirect('/login');

    const commentIdObj = new mongoose.Types.ObjectId(validatedProps.commentId);
    const dbComment = await Comment.findById(commentIdObj)
      .populate([
        { path: 'owner', select: 'name email githubId avatarUrl' },
        {
          path: 'comments',
          populate: { path: 'owner', },
          options: { limit: 20, sort: { createdAt: -1 } },
        },
      ])

    if (!dbComment) throw new Error('Comment not found');

    return dbCommentsSchema.parse(dbComment.comments.map((comment) => comment.toJSON()) || []);
  } catch (error) {
    console.error('Failed to fetch comment comments:', error);
    throw new Error('Failed to fetch comment comments');
  }
}






export async function createNestedComment(formData: FormData): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user) return redirect('/login');

    const dbUser = await User.findOne({ githubId: session.user.id });
    if (!dbUser) throw new Error('User not found');
    const parsedUser = dbUserSchema.parse(dbUser.toObject());

    const parsedComment = clientCommentSchema.parse(Object.fromEntries(formData));

    const parentCommentId = new mongoose.Types.ObjectId(parsedComment.postId);
    const dbParentComment = await Comment.findById(parentCommentId).lean();
    if (!dbParentComment) throw new Error('Parent comment not found');

    const commentData: Pick<CommentType, 'owner' | 'title' | 'visibility' | 'media'> = {
      owner: new mongoose.Types.ObjectId(parsedUser._id),
      title: parsedComment.title,
      visibility: dbParentComment.visibility,
    };

    if (parsedComment.file && parsedComment.file.size > 0) {
      const buffer = Buffer.from(await parsedComment.file.arrayBuffer());
      commentData.media = {
        size: parsedComment.file.size,
        mimeType: parsedComment.file.type,
        mediaName: parsedComment.file.name,
        source: buffer.toString('base64'),
        lastModified: new Date(),
      };
    }

    const newComment = await Comment.create(commentData);
    await Comment.findByIdAndUpdate(parentCommentId, { $push: { comments: newComment._id } }, { new: true });

    revalidatePath(`/posts`);
  } catch (error) {
    console.error('Failed to create nested comment:', error);
    throw new Error('Failed to create nested comment');
  }
}






const commentLikeActionSchema = z.object({
  likeStatus: z.enum(['like', 'unlike']),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid comment ID'),
});

export async function commentLikeAction(formData: FormData): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user) return redirect('/login');

    const dbUser = await User.findOne({ githubId: session.user.id });
    if (!dbUser) throw new Error('User not found');
    const parsedUser = dbUserSchema.parse(dbUser.toObject());

    const parsedLikeData = commentLikeActionSchema.parse(Object.fromEntries(formData));

    const commentId = new mongoose.Types.ObjectId(parsedLikeData.id);
    const userId = new mongoose.Types.ObjectId(parsedUser._id);
    const update = parsedLikeData.likeStatus === 'like'
      ? { $addToSet: { likes: userId } }
      : { $pull: { likes: userId } };

    const dbComment = await Comment.findByIdAndUpdate(commentId, update, { new: true }).lean();
    if (!dbComment) throw new Error('Comment not found');

    revalidatePath(`/home`);
  } catch (error) {
    console.error('Failed to like/unlike comment:', error);
    throw new Error('Failed to like/unlike comment');
  }
}





export async function getUserId(): Promise<string> {
  try {
    const session = await auth();
    if (!session?.user) return redirect('/login');

    const dbUser = await User.findOne({ githubId: session.user.id });
    if (!dbUser) throw new Error('User not found');

    return dbUserSchema.parse(dbUser.toObject())._id;
  } catch (error) {
    console.error('Failed to fetch user ID:', error);
    throw new Error('Failed to fetch user ID');
  }
}



const getCommentPropsSchema = z.object({
  commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid comment ID'),
});

export async function getComment({commentId}: {commentId: string}): Promise<DbPostType> {
    try {
      const validatedProps = getCommentPropsSchema.parse({ commentId });

      const session = await auth();
      if (!session?.user) return redirect("/login");

      const commentIdObj = new mongoose.Types.ObjectId(validatedProps.commentId);
      const dbComment = await Comment.findById(commentIdObj).populate("owner");

      if (!dbComment) throw new Error("Comment not found");

      return dbCommentSchema.parse(dbComment.toObject());
    } catch (error) {
      console.error("Failed to fetch comment comments:", error);
      throw new Error("Failed to fetch comment comments");
    }
}