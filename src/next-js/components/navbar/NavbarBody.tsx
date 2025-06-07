import Link from "next/link";
import HomeIcon from "../svg/HomeIcon";
import SearchIcon from "../svg/SearchIcon";
import MessageIcon from "../svg/MessageIcon";
import NotificationIcon from "../svg/NotificationIcon";
import GrokIcon from "../svg/GrokIcon";
import CommunityIcon from "../svg/CommunityIcon";
import BookmarkIcon from "../svg/BookmarkIcon";
import DynamicNavSpan from "./DynamicNavSpan";
import NewPostDialog from "./NewPostDialog";
import TwitterIcon from "../svg/TwitterIcon";
import ProfileIcon from "../svg/ProfileIcon";
import MoreLinksDialog from "./MoreLinksDialog";
import { SvgIconProps } from "../svg/type-utility/iconTypes";
import { User } from "next-auth";

type NavlinksType = {
  url: string;
  size: number;
  text: string;
  Icon: ({
    width,
    height,
    className,
  }: SvgIconProps) => Promise<React.JSX.Element>;
};

type NavbarBodyProps = {
  user: User
}

export default function NavbarBody({user}: NavbarBodyProps) {
  const navlinks: NavlinksType[] = [
    { url: "/home", Icon: HomeIcon, size: 30, text: "Home" },
    { url: "/explore", Icon: SearchIcon, size: 30, text: "Explore" },
    { url: "/notifications", Icon: NotificationIcon, size: 30, text: "Notifications" },
    { url: "/messages", Icon: MessageIcon, size: 30, text: "Messages" },
    { url: "/grok", Icon: GrokIcon, size: 30, text: "Grok" },
    { url: "/bookmarks", Icon: BookmarkIcon, size: 30, text: "Bookmarks" },
    { url: "/communities", Icon: CommunityIcon, size: 30, text: "Communities" },
    { url: "/premium", Icon: TwitterIcon, size: 30, text: "Premium" },
    { url: `/${user.email}`, Icon: ProfileIcon, size: 30, text: "Profile" },
  ];
  return (
    <div>
      <nav>
        <ul>
          {navlinks.map(({ url, Icon, size, text }) => <NavbarLink key={text} url={url} Icon={Icon} size={size} text={text} />)}
        </ul>
      </nav>
      <MoreLinksDialog />
      <NewPostDialog user={user}/>
    </div>
  );
}

async function NavbarLink({url, Icon, size, text}: NavlinksType) {
  return (
    <li className="my-1">
      <Link
        href={url}
        className="flex gap-x-4 items-center text-xl p-2 rounded-lg hover:bg-lighthover"
      >
        <Icon width={size} height={size} className="max-xl:[&_+_span]:hidden"/>
        <DynamicNavSpan url={url} text={text} />
      </Link>
    </li>
  )
}
