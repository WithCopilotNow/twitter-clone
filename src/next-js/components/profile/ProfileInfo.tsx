import Link from "next/link";
import CalendarIcon from "../svg/CalendarIcon";
import VerifiedIcon from "../svg/VerifiedIcon";

type ProfileInfoProps = {
  followers: number,
  following: number,
  createdAt: Date,
  email: string
}

export default async function ProfileInfo({followers, following, createdAt, email}: ProfileInfoProps) {
  return (
    <div className="p-4">
      <div>
        <div className="flex items-center gap-x-2">
          <h1 className="text-2xl font-semibold">Roshan Divekar</h1>
          <Link href="/premium" className="flex items-center gap-x-1 px-4 py-1 rounded-full bg-black text-white shadow-even cursor-pointer hover:bg-lighthover">
              <VerifiedIcon width={20} height={20} className="fill-blue-500"/>
              <span className="text-sm">Get Verified</span>
          </Link>
        </div>
        <h2 className="text-gray-500 text-xl">{`@${email}`}</h2>
      </div>
      <div className="text-gray-500 flex items-center gap-x-1 my-3">
        <CalendarIcon width={20} height={20} className="stroke-gray-500" />
        <p>{`Joined ${createdAt.toLocaleString("en-US", {month: "short", year: "numeric"})}`}</p>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-1">
            <span>{following}</span>
            <Link href="#" className="hover:underline text-gray-500">Following</Link>
        </div>
        <div className="flex items-center gap-x-1">
            <span>{followers}</span>
            <Link href="#" className="hover:underline text-gray-500">Followers</Link>
        </div>
      </div>
    </div>
  )
}
