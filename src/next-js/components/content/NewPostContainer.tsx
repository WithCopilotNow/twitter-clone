import VisibilityDailog from "../navbar/VisibilityDailog";
import Link from "next/link";
import { createPostAction } from "@/next-js/server-action/actions";
import SubmitButton from "./SubmitButton";
import { User } from "next-auth";
import MediaContainer from "../navbar/MediaContainer";

type NewPostContainerProps = {
  user: User
}

export default async function NewPostContainer({user}: NewPostContainerProps) {
  return (
    <form action={createPostAction} className="flex flex-col p-4 pb-0">
      <div className="grow flex">
        <div>
          <Link href={`/${user.email}`} className="block size-10 rounded-full bg-gray-500 shrink-0 overflow-hidden">
            <img src={user.image || "https://picsum.photos/seed/picsum/200/300"} alt={user.name || undefined} className="size-full object-cover" />
          </Link>
        </div>
        <div className="grow-1">
          <textarea name="title" id="title" placeholder="What's happening?" className="w-full resize-none outline-none field-sizing-content text-xl p-2 text-white break-all" required></textarea>
          <VisibilityDailog positionValue="bottom center" />
          <div className="flex items-center border-t-1 border-solid border-lighthover py-2 text-white">
            <MediaContainer className="flex"/>
            <SubmitButton text="Post" pendingText="Composing..." className="ml-auto px-5 py-2 bg-gray-600 hover:bg-gray-500 font-bold rounded-full text-sm cursor-pointer"/>
          </div>
        </div>
      </div>
    </form>
  )
}


