import { DbPostType } from "@/models/post"
import { getTime } from "@/next-js/utility/getTime";
import PostOptionsDialog from "./PostOptionsDialog";
import PostFooter from "./PostFooter";
import Link from "next/link";
import { User } from "next-auth";
import { getUserId } from "@/next-js/server-action/actions";
import Image from "next/image";

type PostContainerProps = {
  postData: DbPostType,
  user: User,
  likeAction: (formData: FormData) => void,
  commentAction: (formData: FormData) => void,
  postId?: string
} 

export default async function PostContainer({postData, user, likeAction, commentAction, postId}: PostContainerProps) {
    const  {
      _id,
      title,
      owner,
      media,
      createdAt,
    } = postData;
    const time = await getTime(createdAt);
    const url = (postId) ? `/posts/${postId}/comments/${_id}` : `/posts/${_id}`;
    const userId = await getUserId();

  return (
    <section className="px-4 py-1 flex gap-x-2 border-y-1 border-lighthover min-w-md">
      <div className="size-10 rounded-full bg-lighthover overflow-hidden mt-3 shrink-0">
        <Link href={`/${postData.owner.userId}`} className="block size-full bg-no-repeat bg-cover" style={{backgroundImage: `url(${owner.avatarUrl})`}}></Link>
      </div>
      <div className="grow-1">
        <div className="flex items-end gap-x-1">
          <h1 className="font-semibold">
            <Link href={`/${postData.owner.userId}`} className="block size-full hover:underline">{owner.name}</Link>
          </h1>
          <h2 className="text-gray-500">
            <Link href={`/${postData.owner.userId}`} className="block size-full">{`@${owner.userId} . ${time}`}</Link>
          </h2>
          <PostOptionsDialog owner={owner} user={user} userId={userId} />
        </div>
        <p>
          <Link href={url} className="block">{title}</Link>
        </p>
        {media && (<div className="w-full aspect-video rounded-2xl bg-lighthover overflow-hidden my-2">
          <Link href={url} className="block size-full relative">
            <Image src={media.dataUrl} alt="" layout="fill" objectFit="contain"/>
          </Link>
        </div>)}
        <PostFooter postData={postData} user={user} likeAction={likeAction} commentAction={commentAction} userId={userId}/>
      </div>
    </section>
  )
}
