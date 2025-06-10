import { auth } from "@/auth";
import PostsContainer from "@/next-js/components/content/PostsContainer";
import CommentContainer from "@/next-js/components/post/CommentContainer";
import CommentPostContainer from "@/next-js/components/post/CommentPostContainer";
import { commentLikeAction, createNestedComment, getComment, getCommentComments } from "@/next-js/server-action/actions";

type CommentPageProps = {
  params: Promise<{postId:string, commentId: string}>
}

export default async function CommentPage({params}: CommentPageProps) {
  const session = await auth();
  const {postId, commentId} = await params;
  const dbComment = await getComment({commentId})
  const dbComments = await getCommentComments({commentId});
  return (!session || !session.user) ? undefined : (
    <>
      <CommentPostContainer postData={dbComment} user={session.user} likeAction={commentLikeAction} commentAction={createNestedComment}/>
      <CommentContainer user={session.user} id={dbComment._id} commentAction={createNestedComment}/>
      <PostsContainer dbPosts={dbComments} user={session.user} likeAction={commentLikeAction} commentAction={createNestedComment} postId={postId}/>
    </>
  )
}
