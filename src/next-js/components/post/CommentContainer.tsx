import { User } from "next-auth"
import Link from "next/link"
import SubmitButton from "../content/SubmitButton"
import MediaContainer from "../navbar/MediaContainer"

type CommentContainerProps = {
    user: User,
    id: string,
    commentAction: (formData: FormData) => void,
}
export default async function CommentContainer({user, id, commentAction}: CommentContainerProps) {
  return (
    <form action={commentAction} className="p-4 border-b-1 border-lighthover">
      <input type="text" name="postId" defaultValue={id} hidden/>
      <div className="flex">
        <div className="size-10 rounded-full bg-lighthover overflow-hidden shrink-0">
          <Link href={`/${user.email}`} className="block size-full">
            <img src={user.image || undefined} alt="" className="size-full object-cover"/>
          </Link>
        </div>
        <div className="grow">
          <textarea
          name="title"
          placeholder="Post you reply"
          className="resize-none outline-none field-sizing-content text-xl p-2 text-white break-all w-full"
          required
          ></textarea>
          <div className="w-full flex">
            <MediaContainer className="flex"/>
            <SubmitButton text="Reply" pendingText="Composing..." className="px-4 py-1 rounded-full bg-gray-600 text-white hover:bg-gray-500 ml-auto items-center"/>
          </div>
        </div>
      </div>
    </form>
  )
}
