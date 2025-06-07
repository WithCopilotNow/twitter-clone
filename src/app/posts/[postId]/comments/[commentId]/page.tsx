import { auth } from "@/auth";
import PostsContainer from "@/next-js/components/content/PostsContainer";
import CommentContainer from "@/next-js/components/post/CommentContainer";
import CommentPostContainer from "@/next-js/components/post/CommentPostContainer";
import { commentLikeAction, createCominCom, getCommentComments } from "@/next-js/server-action/actions";

type CommentPageProps = {
  params: Promise<{postId:string, commentId: string}>
}

export default async function CommentPage({params}: CommentPageProps) {
  const session = await auth();
  const {postId, commentId} = await params;
  const dbPostComment = await getCommentComments(commentId);
  return (!session || !session.user) ? undefined : (
    <>
      <CommentPostContainer postData={dbPostComment} user={session.user} likeAction={commentLikeAction}/>
      <CommentContainer user={session.user} id={dbPostComment._id.toHexString()} commentAction={createCominCom}/>
      <PostsContainer dbPosts={dbPostComment.comments} user={session.user} likeAction={commentLikeAction} commentAction={createCominCom} postId={postId}/>
    </>
  )
}
