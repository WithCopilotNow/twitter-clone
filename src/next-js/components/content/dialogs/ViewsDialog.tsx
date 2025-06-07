import { getUniqueId } from "@/next-js/server-action/actions";
import ViewsIcon from "../../svg/ViewsIcon";

export default async function ViewsDialog() {
  const id = await getUniqueId();
  return (
    <div>
      <button type="button" popoverTarget={id} className="p-2 rounded-full hover:bg-lightblue group transition-colors">
        <ViewsIcon width={20} height={20} className="stroke-gray-400 group-hover:stroke-blue-500 transition-colors"/>
        <span className="hidden absolute bg-gray-600 text-white px-1 rounded-sm -bottom-1/1 left-1/2 -translate-1/2 group-hover:block starting:opacity-0 transition-opacity delay-500">Views</span>
      </button>
      <div popover="auto" id={id} className="w-2xl h-100 bg-black text-white rounded-xl shadow-even top-20 left-1/3 overflow-hidden"></div>
    </div>
  )
}
