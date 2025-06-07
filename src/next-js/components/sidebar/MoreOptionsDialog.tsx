import { getUniqueId } from "@/next-js/server-action/actions";
import MoreHoriIcon from "../svg/MoreHoriIcon";
import SadEmojiIcon from "../svg/SadEmojiIcon";

const moreOptions = ["The associated content is not relevent", "This trend is spam", "This trend is abusive or harmful", "Not interested in this", "This trend is a duplicate"] as const

export default async function MoreOptionsDialog() {
  const id = await getUniqueId();
  const anchor = {
    anchorName: `--${id}-anchor`
  }
  const position = {
    positionAnchor: `--${id}-anchor`,
    positionArea: "center left"
  }

  return (
    <div>
      <button type="button" popoverTarget={id} className="group p-1 rounded-full hover:bg-lighthover relative cursor-pointer" style={anchor as any}>
        <MoreHoriIcon width={20} height={20} className="group-hover:fill-blue-400"/>
        <span className="absolute -translate-x-2 translate-y-1 text-sm bg-gray-600 px-1 rounded-xs group-hover:block hidden starting:opacity-0 transition-opacity delay-500 min-w-max">More</span>
      </button>
      <div popover="auto" id={id} className="shadow-even rounded-xl bg-black text-white min-w-xs -translate-x-2 py-2" style={position as any}>
        <ul>
          {moreOptions.map((option) => (
            <li key={option}>
              <button type="button" className="flex gap-x-2 px-4 py-2 cursor-pointer hover:bg-lighthover w-full">
                <SadEmojiIcon />
                <span>{option}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
