import { bookmarkPostAction } from "@/next-js/server-action/actions";
import CommentDialog from "./dialogs/CommentDialog";
import RepostDialog from "./dialogs/RepostDialog";
import ShareDialog from "./dialogs/ShareDialog";
import ViewsDialog from "./dialogs/ViewsDialog";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import { DbPostType } from "@/models/post";
import { User } from "next-auth";
import { DbCommentType } from "@/models/comment";

type PostFooterType = {
  postData: DbPostType | DbCommentType,
  user: User,
  userId: string,
  likeAction: (formData: FormData) => void,
  commentAction: (formData: FormData) => void,
}

export default async function PostFooter({postData, user, userId, likeAction, commentAction}: PostFooterType) {
  const  {
    _id,
    likes
  } = postData;
  const isLiked = likes.some((like) => like === userId);
  return (
    <div className="flex justify-between items-center pb-1">
      <CommentDialog postData={postData} user={user} commentAction={commentAction}/>
      <RepostDialog />
      <form action={likeAction}>
        <input type="text" name="id" defaultValue={_id} hidden/>
        <LikeButton isLiked={isLiked} likesCount={likes.length}/>
      </form>
      <ViewsDialog />
      <div className="flex gap-x-2">
        <form action={bookmarkPostAction}>
          <BookmarkButton />
        </form>
        <ShareDialog />
      </div>
    </div>
  )
}
