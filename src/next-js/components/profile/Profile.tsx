import { createCommentAction, getUserPosts, postLikeAction } from "@/next-js/server-action/actions";
import PostsContainer from "../content/PostsContainer";
import { auth } from "@/auth";

type ProfileProps = {
  indentity: string
}

export default async function Profile({indentity}: ProfileProps) {
    const session = await auth();
    const dbPosts = await getUserPosts({email: `${indentity}@gmail.com`});
  return (!session || !session.user) ? undefined : (
    <PostsContainer dbPosts={dbPosts} user={session.user} likeAction={postLikeAction} commentAction={createCommentAction}/>
  )
}
