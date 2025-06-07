"use client"

type ProfileHeaderProps = {
    name: string,
    postCount: number
}
export default function ProfileHeader({name, postCount}: ProfileHeaderProps) {
  return (
    <div onClick={() => {scrollTo({ top: 0, left: 0, behavior: "smooth" })}} className="w-full cursor-pointer">
        <h1 className="text-white text-xl font-semibold">{`${name}`}</h1>
        <p className="text-gray-500">{`${postCount} posts`}</p>
    </div>
  )
}
