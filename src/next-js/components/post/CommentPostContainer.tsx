import { User } from "next-auth"
import Link from "next/link"
import PostOptionsDialog from "../content/PostOptionsDialog"
import PostFooter from "../content/PostFooter"
import { getTime } from "@/next-js/utility/getTime"
import { getUserId } from "@/next-js/server-action/actions"
import Image from "next/image"
import { DbPostType } from "@/models/post"

type CommentPostContainerProps = {
    postData: DbPostType,
    user: User,
    likeAction: (formData: FormData) => void,
    commentAction: (formData: FormData) => void
}
export default async function CommentPostContainer({postData, user, likeAction, commentAction}: CommentPostContainerProps) {
  const  {
      title,
      owner,
      media,
      createdAt,
    } = postData;
    const time = await getTime(createdAt);
    const userId = await getUserId();
  return (
    <section className="px-4 border-y-1 border-lighthover">
      <div className="flex items-center gap-x-2 py-2">
        <div className="size-10 rounded-full bg-lighthover overflow-hidden shrink-0">
          <Link href={`/${postData.owner.userId}`} className="block size-full bg-no-repeat bg-cover" style={{backgroundImage: `url(${owner.avatarUrl})` || undefined}}></Link>
        </div>
        <div className="grow-1 flex items-center">
          <div className="grow-1 flex flex-col items-start">
            <h1 className="font-semibold">
              <Link href={`/${postData.owner.userId}`} className="block size-full hover:underline">{owner.name}</Link>
            </h1>
            <h2 className="text-gray-500">
              <Link href={`/${postData.owner.userId}`} className="block size-full">{`@${owner.userId} . ${time}`}</Link>
            </h2>
          </div>
          <Link href="/premium" className="bg-white px-4 py-1 rounded-full text-black font-semibold hover:bg-gray-300 transition-colors">Subscribe</Link>
          <PostOptionsDialog owner={owner} user={user} userId={userId}/>
        </div>
      </div>
      <div>
        <p className="pt-1 pb-2">{title}</p>
        {media && (<div className="w-full aspect-video rounded-2xl bg-lighthover overflow-hidden my-2 relative">
          <Image src={media.dataUrl} alt="" layout="fill" objectFit="contain"/>
        </div>)}
        <p className="text-gray-500 py-2 border-b-1 border-lighthover">{`${createdAt.toLocaleTimeString("en-IN", {hour: "2-digit", minute: "2-digit"})} . ${createdAt.toLocaleString("en-IN", {month: "short", year: "numeric"})}`}</p>
        <PostFooter postData={postData} user={user} likeAction={likeAction} commentAction={commentAction} userId={userId}/>
      </div>
    </section>
  )
}
