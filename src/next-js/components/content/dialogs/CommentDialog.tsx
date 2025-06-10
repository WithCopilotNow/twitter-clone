import { getUniqueId } from "@/next-js/server-action/actions";
import CommentIcon from "../../svg/CommentIcon";
import SubmitButton from "../SubmitButton";
import CloseIcon from "../../svg/CloseIcon";
import Link from "next/link";
import { getTime } from "@/next-js/utility/getTime";
import { DbPostType } from "@/models/post";
import { User } from "next-auth";
import MediaContainer from "../../navbar/MediaContainer";
import { DbCommentType } from "@/models/comment";

type CommentDialogProps = {
  postData: DbPostType | DbCommentType,
  user: User,
  commentAction: (formData: FormData) => void,
  commentParentId?: string
};

export default async function CommentDialog({postData, user, commentAction, commentParentId}: CommentDialogProps) {
  const { _id, title, owner, createdAt, comments } = postData;
  const id = await getUniqueId();
  const time = await getTime(createdAt);
  const commentCount = comments.length;
  return (
    <div>
      <button
        type="button"
        popoverTarget={id}
        className="p-2 rounded-full hover:bg-lightblue group transition-colors relative flex gap-x-1 items-center"
      >
        <CommentIcon
          width={20}
          height={20}
          className="stroke-gray-400 group-hover:stroke-blue-500 transition-colors"
        />
        <span className={`${commentCount > 0 ? "text-gray-400" : "text-transparent"}`}>{`${commentCount > 0 ? commentCount : ""}`}</span>
        <span className="hidden absolute bg-gray-600 text-white px-1 rounded-sm -bottom-1/1 left-1/2 -translate-1/2 group-hover:block starting:opacity-0 transition-opacity delay-500">
          Comment
        </span>
      </button>
      <div
        popover="auto"
        id={id}
        className="w-xl left-1/2 top-20 -translate-x-1/2 shadow-even bg-black text-white rounded-2xl backdrop:bg-lightblue"
      >
        <form action={commentAction} className="flex flex-col h-full">
          <input type="text" name="postId" defaultValue={_id} hidden/>
          {commentParentId && <input type="text" name="id" defaultValue={commentParentId} hidden/>}
          <div className="pl-4 pr-8 py-4 flex items-center">
            <button
              type="button"
              className="cursor-pointer p-1 rounded-full hover:bg-lighthover"
              popoverTarget={id}
            >
              <CloseIcon width={20} height={20} />
            </button>
            <button
              type="submit"
              className="ml-auto font-medium text-blue-400 cursor-pointer"
              popoverTarget={id}
            >
              Drafts
            </button>
          </div>
          <div className="px-4 flex gap-x-2">
            <div className="flex flex-col items-center">
              <Link
                href={`/${owner.userId}`}
                className="block size-10 rounded-full bg-lighthover overflow-hidden shrink-0 bg-no-repeat bg-cover"
                style={{backgroundImage: `url(${owner.avatarUrl})` || undefined}}
              ></Link>
              <div className="grow-1 w-1 bg-lighthover"></div>
            </div>
            <div className="grow-1 min-h-30">
              <div className="flex items-end gap-x-1">
                <h1 className="font-semibold">
                  <Link
                    href={`/${owner.userId}`}
                    className="block size-full hover:underline"
                  >
                    {owner.name}
                  </Link>
                </h1>
                <h2 className="text-gray-500">
                  <Link href={`/${owner.userId}`} className="block size-full">{`@${owner.userId} . ${time}`}</Link>
                </h2>
              </div>
              <p>
                <Link href={`/posts/${_id}`} className="block">
                  {title}
                </Link>
              </p>
            </div>
          </div>
          <div className="grow flex px-4 pb-2">
            <div className="size-10 rounded-full bg-gray-500 shrink-0 overflow-hidden">
              <Link href={`/${user.email}`} className="block size-full bg-no-repeat bg-cover" style={{backgroundImage: `url(${user.image})` || undefined}}></Link>
            </div>
            <div className="grow min-h-30">
              <textarea
                name="title"
                placeholder="Post you reply"
                className="resize-none outline-none field-sizing-content text-xl p-2 text-white break-all"
                required
              ></textarea>
            </div>
          </div>
          <div className="flex items-center border-t-1 border-solid border-gray-500 p-3 text-white">
            <MediaContainer className="flex"/>
            <SubmitButton
              text="Reply"
              pendingText="Composing..."
              className="ml-auto px-5 py-2 bg-gray-600 hover:bg-gray-500 font-medium rounded-full text-base cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
