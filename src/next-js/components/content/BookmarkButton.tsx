"use client"
import { useState } from "react"
import BookmarkIcon from "../svg/client-svg/BookmarkIcon"

export default function BookmarkButton() {
    const [bookmark, setBookmark] = useState<boolean>(false)
  return (
    <button type="submit" className="p-2 rounded-full hover:bg-lightblue group transition-colors cursor-pointer relative" onClick={() => setBookmark(!bookmark)}>
        <BookmarkIcon width={20} height={20} className={`${bookmark ? "fill-blue-600 stroke-blue-600" : "stroke-gray-400 group-hover:stroke-blue-600"} transition-colors`}/>
        <span className="hidden absolute bg-gray-600 text-white px-1 rounded-sm -bottom-1/1 left-1/2 -translate-1/2 group-hover:block starting:opacity-0 transition-opacity delay-500">Bookmark</span>
    </button>
  )
}
