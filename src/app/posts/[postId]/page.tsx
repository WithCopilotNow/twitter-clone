import { auth } from "@/auth";
import PostsContainer from "@/next-js/components/content/PostsContainer";
import CommentContainer from "@/next-js/components/post/CommentContainer";
import CommentPostContainer from "@/next-js/components/post/CommentPostContainer";
import { commentLikeAction, createNestedComment, createCommentAction, getComments, postLikeAction, getPost } from "@/next-js/server-action/actions";

type PostProps = {
  params: Promise<{postId: string}>
}

export default async function Post({params}: PostProps) {
  const session = await auth();
  const {postId} = await params;
  const dbPost = await getPost({id: postId})
  const dbPostComment = await getComments({postId});
  return (!session || !session.user) ? undefined : (
    <>
      <CommentPostContainer postData={dbPost} user={session.user} likeAction={postLikeAction} commentAction={createCommentAction}/>
      <CommentContainer user={session.user} id={dbPost._id} commentAction={createCommentAction}/>
      <PostsContainer dbPosts={dbPostComment} user={session.user} likeAction={commentLikeAction} commentAction={createNestedComment} postId={postId}/>
    </>
  )
}


