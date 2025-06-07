import Link from "next/link";
import TwitterIcon from "../svg/TwitterIcon";

export default async function NavbarHeader() {
  return (
    <div className="flex justify-start">
      <Link href="/home" className="p-2 rounded-full hover:bg-lighthover">
        <TwitterIcon width={30} height={30} />
      </Link>
    </div>
  )
}
