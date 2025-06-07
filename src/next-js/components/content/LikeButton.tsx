"use client"
import { useState } from "react"
import LikeIcon from "../svg/client-svg/LikeIcon"

type LikeButtonProps = {
  isLiked: boolean,
  likesCount: number
}

export default function LikeButton({isLiked, likesCount}: LikeButtonProps) {
    const [like, setLike] = useState<boolean>(isLiked)
  return (
    <button type="submit" onClick={() => setLike(!like)} className="p-2 rounded-full hover:bg-lightblue group transition-colors cursor-pointer flex gap-x-1 items-center relative">
        <input type="text" name="likePost" value={like ? "true" : "false"} readOnly hidden />
        <LikeIcon width={20} height={20} className={`${like ? "fill-red-600 stroke-red-600" : "stroke-gray-400 group-hover:stroke-red-600"} transition-colors`}/>
        <span className="hidden absolute bg-gray-600 text-white px-1 rounded-sm -bottom-1/2 left-1/2 -translate-x-1/2 group-hover:block starting:opacity-0 transition-opacity delay-500">Like</span>
        <span className="text-gray-400">{`${likesCount > 0 ? likesCount : ""}`}</span>
    </button>
  )
}
