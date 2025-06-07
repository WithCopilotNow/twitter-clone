import { auth } from "@/auth";
import ContentHeader from "@/next-js/components/content/ContentHeader";
import NewPostContainer from "@/next-js/components/content/NewPostContainer";
import PostsContainer from "@/next-js/components/content/PostsContainer";
import { createCommentAction, getPosts, postLikeAction } from "@/next-js/server-action/actions";

export default async function Home() {
  const session = await auth();
  const dbPosts = await getPosts();
  return (!session || !session.user) ? undefined : (
    <>
      <ContentHeader />
      <NewPostContainer user={session.user}/>
      <PostsContainer dbPosts={dbPosts} user={session.user} likeAction={postLikeAction} commentAction={createCommentAction}/>
    </>
  )
}
