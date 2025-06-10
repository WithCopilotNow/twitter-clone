import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import PostContainer from "./PostContainer";
import { DbPostType } from "@/models/Post";
import { User } from "next-auth";

type PostsContainerProps = {
    dbPosts: DbPostType[],
    user: User,
    likeAction: (formData: FormData) => void,
    commentAction: (formData: FormData) => void,
    postId?: string
}

export default async function PostsContainer({dbPosts, user, likeAction, commentAction, postId}: PostsContainerProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <section className="pb-50">
        {dbPosts.map((post) => <PostContainer key={post._id} postData={post} user={user} likeAction={likeAction} commentAction={commentAction} postId={postId}/>)}
      </section>
    </Suspense>
  )
}
