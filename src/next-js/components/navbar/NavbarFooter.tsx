import MoreHoriIcon from "../svg/MoreHoriIcon";
import Link from "next/link";
import { User } from "next-auth";

type NavbarFooterProps = {
  user: User
}

export default async function NavbarFooter({user}: NavbarFooterProps) {
  return (
    <div className="mt-auto mb-4">
      <button type="button" popoverTarget="accountSettings" className="w-full flex items-center hover:bg-lighthover p-2 rounded-lg [anchor-name:--settingDialong-anchor]">
        <div className="size-10 rounded-full bg-gray-500 shrink-0 overflow-hidden">
          <img src={user.image || undefined} alt={`${user.name}`} className="size-full object-cover"/>
        </div>
        <div className="px-3 text-sm text-left max-xl:hidden">
          <h1 className="font-bold">{user.name}</h1>
          <span className="text-gray-400 font-semibold">{`@${user.email}`}</span>
        </div>
        <div className="ml-auto max-xl:hidden">
          <MoreHoriIcon />
        </div>
      </button>
      <div popover="auto" id="accountSettings" className='w-2xs bg-black text-white [position-anchor:--settingDialong-anchor] [top:anchor(top)] -translate-y-11/10 translate-x-3/4 rounded-xl shadow-even'>
        <ul className="py-4 text-lg">
          <li>
            <Link href="#" className="inline-block w-full px-4 py-2 hover:bg-lighthover">Add an existing account</Link>
          </li>
          <li>
            <Link href="/logout" className="inline-block w-full px-4 py-2 hover:bg-lighthover">{`Logout @${user.email}`}</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
