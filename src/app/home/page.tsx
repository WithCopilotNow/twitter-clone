import { auth } from "@/auth";
import { DbPostType } from "@/models/post";
import ContentHeader from "@/next-js/components/content/ContentHeader";
import NewPostContainer from "@/next-js/components/content/NewPostContainer";
import PostsContainer from "@/next-js/components/content/PostsContainer";
import { createCommentAction, getPosts, postLikeAction } from "@/next-js/server-action/actions";
import { Session } from "next-auth";

export default async function Home() {
  const session: Session | null = await auth();
  const dbPosts: DbPostType[] = await getPosts();
  return (!session || !session.user) ? undefined : (
    <>
      <ContentHeader />
      <NewPostContainer user={session.user}/>
      <PostsContainer dbPosts={dbPosts} user={session.user} likeAction={postLikeAction} commentAction={createCommentAction}/>
    </>
  )
}
