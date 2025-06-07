import { auth } from "@/auth";
import PostsContainer from "@/next-js/components/content/PostsContainer";
import CommentContainer from "@/next-js/components/post/CommentContainer";
import CommentPostContainer from "@/next-js/components/post/CommentPostContainer";
import { commentLikeAction, createCominCom, createCommentAction, getPostComments, postLikeAction } from "@/next-js/server-action/actions";

type PostProps = {
  params: Promise<{postId: string}>
}

export default async function Post({params}: PostProps) {
  const session = await auth();
  const {postId} = await params;
  const dbPostComment = await getPostComments(postId);
  return (!session || !session.user) ? undefined : (
    <>
      <CommentPostContainer postData={dbPostComment} user={session.user} likeAction={postLikeAction}/>
      <CommentContainer user={session.user} id={dbPostComment._id.toHexString()} commentAction={createCommentAction}/>
      <PostsContainer dbPosts={dbPostComment.comments} user={session.user} likeAction={commentLikeAction} commentAction={createCominCom} postId={postId}/>
    </>
  )
}


