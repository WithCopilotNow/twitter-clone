import { getUniqueId } from "@/next-js/server-action/actions";
import RepostIcon from "../../svg/RepostIcon";
import PenIcon from "../../svg/PenIcon";

export default async function RepostDialog() {
  const id = await getUniqueId();
  const anchor = {
    anchorName: `--${id}-anchor`
  }
  const position = {
    positionAnchor: `--${id}-anchor`,
    positionArea: "bottom center"
  }
  return (
    <div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <button type="button" popoverTarget={id} className="p-2 rounded-full hover:bg-lightblue group transition-colors relative" style={anchor as any}>
        <RepostIcon width={20} height={20} className="stroke-gray-400 group-hover:stroke-green-500 transition-colors"/>
        <span className="hidden absolute bg-gray-600 text-white px-1 rounded-sm -bottom-1/1 left-1/2 -translate-1/2 group-hover:block starting:opacity-0 transition-opacity delay-500">Repost</span>
      </button>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <div popover="auto" id={id} className="bg-black text-white rounded-xl shadow-even py-2" style={position as any}>
        <ul>
          <li>
            <button type="button" popoverTarget={id} className="flex items-center gap-x-2 px-4 py-2 hover:bg-lighthover w-full">
              <RepostIcon />
              <span>Repost</span>
            </button>
          </li>
          <li> 
            <button type="button" popoverTarget={id} className="flex items-center gap-x-2 px-4 py-2 hover:bg-lighthover w-full">
              <PenIcon />
              <span>Quote</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
