import Link from "next/link";

export default async function ContentHeader() {
  return (
    <div className="flex border-b-1 border-lighthover sticky top-0 z-10 pt-1 bg-black">
      <Link href="/home" className="block grow-1 text-center hover:bg-lighthover">
          <span className="inline-block font-bold py-3 border-b-4 border-blue-500 text-sm">For you</span>
      </Link>
      <Link href="/home" className="block grow-1 text-center hover:bg-lighthover">
          <span className="inline-block font-bold text-gray-500 py-3 text-base">Following</span>
      </Link>
    </div>
  )
}
