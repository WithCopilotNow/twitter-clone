import { getUniqueId } from "@/next-js/server-action/actions"
import MoreHoriIcon from "../svg/MoreHoriIcon"
import GrokIcon from "../svg/GrokIcon"
import { DbPostType } from "@/models/post";
import UnfollowIcon from "../svg/UnfollowIcon";
import FollowIcon from "../svg/FollowIcon";
import BlockIcon from "../svg/BlockIcon";
import FlagIcon from "../svg/FlagIcon";
import AddToListIcon from "../svg/AddToListIcon";
import MuteIcon from "../svg/MuteIcon";
import EmbedIcon from "../svg/EmbedIcon";
import CommunityIcon from "../svg/CommunityIcon";
import MegaPhoneIcon from "../svg/MegaPhoneIcon";
import { SvgIconProps } from "../svg/type-utility/iconTypes";
import { User } from "next-auth";

type postOptionsType = {
  text: string,
  Icon: (props: SvgIconProps) => Promise<React.JSX.Element>
}

type PostOptionsDialogProps = {
   user: User,
   userId: string
} & Pick<DbPostType, "owner">;

export default async function PostOptionsDialog({owner, user, userId}: PostOptionsDialogProps) {
    const id = await getUniqueId()
    const anchor = { anchorName: `${id}-anchor` }
    const position = { positionAnchor: `${id}-anchor`, positionArea: "bottom center" }
    const follow: boolean = owner.followers.some((like) => like.toHexString() === userId);
    const postOptions: postOptionsType[] = [
      {text: `Add/remove ${owner.userId} from Lists`, Icon: AddToListIcon },
      {text: `Mute ${owner.userId}`, Icon: MuteIcon },
      {text: "Embed post", Icon: EmbedIcon },
      {text: "Write a Community Note", Icon: CommunityIcon },
      {text: "Request Community Note", Icon: MegaPhoneIcon },
    ]
  return (
    <div className="ml-auto flex items-center translate-y-1/6">
      <button type="button" className="p-2 rounded-full group hover:bg-lightblue translate-x-1/5 transition-colors cursor-pointer">
        <GrokIcon width={20} height={20} className="fill-gray-500 group-hover:fill-blue-500 transition-colors"/>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <button type="button" popoverTarget={id} className="p-2 rounded-full group hover:bg-lightblue transition-colors cursor-pointer" style={anchor as any}>
        <MoreHoriIcon width={20} height={20} className="fill-gray-500 group-hover:fill-blue-500 transition-colors"/>
      </button>
      <div popover="auto" id={id} className="bg-black text-white shadow-even rounded-xl w-max py-2" style={position as any}>
        {user.id != owner._id && <form className="flex flex-col">
          <button className="px-4 py-2 text-left hover:bg-lighthover cursor-pointer flex items-center gap-x-2" type="submit">
            {follow ? <UnfollowIcon className="fill-gray-300" /> : <FollowIcon className="fill-gray-300" />}
            <span>{`${follow ? "Unfollow" : "Follow"} ${owner.userId}`}</span>
          </button>
          <button className="px-4 py-2 text-left hover:bg-lighthover cursor-pointer flex items-center gap-x-2" type="submit">
            <BlockIcon className="fill-gray-300" />
            <span>{`Block ${owner.userId}`}</span>
          </button>
          <button className="px-4 py-2 text-left hover:bg-lighthover cursor-pointer flex items-center gap-x-2" type="submit">
            <FlagIcon className="stroke-gray-300" />
            <span>Report post</span>
          </button>
        </form>}
        <ul>
          {postOptions.map(({Icon, text}) => (
            <li key={text}>
              <button type="button" className="px-4 py-2 text-left hover:bg-lighthover w-full cursor-pointer flex items-center gap-x-2">
                <Icon className="fill-gray-300 stroke-gray-300" />
                <span>{text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
