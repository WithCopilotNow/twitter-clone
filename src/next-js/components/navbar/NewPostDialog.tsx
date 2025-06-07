import CloseIcon from "../svg/CloseIcon";
import VisibilityDailog from "./VisibilityDailog";
import { createPostAction } from "@/next-js/server-action/actions";
import SubmitButton from "../content/SubmitButton";
import { User } from "next-auth";
import MediaContainer from "./MediaContainer";

type NewPostDialogProps = {
  user: User
}

export default async function NewPostDialog({user}: NewPostDialogProps) {
  return (
    <section className="pr-6">
      <button type="button" popoverTarget="navNewPost" className="bg-gray-100 hover:bg-gray-300 transition-colors text-black w-full p-3 text-xl rounded-full font-semibold my-4 max-xl:hidden">Post</button>
      <div popover="auto" id="navNewPost" className="w-xl left-1/2 top-8 -translate-x-1/2 shadow-even bg-black rounded-2xl backdrop:bg-lightblue" >
        <form action={createPostAction} className="flex flex-col h-full">
          <div className="pl-4 pr-8 py-3 flex items-center">
              <button type="button" className="cursor-pointer p-1 rounded-full hover:bg-lighthover" popoverTarget="navNewPost"><CloseIcon width={20} height={20}/></button>
              <button type="submit" className="ml-auto font-medium text-blue-400 cursor-pointer" popoverTarget="navNewPost">Drafts</button>
          </div>
          <div className="grow flex px-4 py-2">
              <div className="size-10 rounded-full bg-gray-500 shrink-0 overflow-hidden">
                  <img src={user.image || undefined} alt={user.name || undefined} className="size-full object-cover" />
              </div>
              <div className="grow min-h-30">
                  <textarea name="title" id="title" placeholder="What's happening?" className="resize-none outline-none field-sizing-content text-xl p-2 text-white break-all" required></textarea>
              </div>
          </div>
          <VisibilityDailog positionValue="bottom left"/>
          <div className="flex items-center border-t-1 border-solid border-gray-500 p-3 text-white">
              <MediaContainer className="flex"/>
              <SubmitButton text="Post" pendingText="Composing..." className="ml-auto px-5 py-2 bg-gray-600 hover:bg-gray-500 font-medium rounded-full text-base cursor-pointer"/>
          </div>
        </form>
      </div>
    </section>
  )
}
