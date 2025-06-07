import MoreIcon from "../svg/MoreIcon";

export default async function MoreLinksDialog() {
  return (
    <div>
        <button type="button" popoverTarget="settings" className="w-full flex gap-x-4 items-center text-xl p-2 rounded-lg hover:bg-lighthover [anchor-name:--moreLinksDialog-anchor]">
            <MoreIcon width={30} height={30}/>
            <span className="max-xl:hidden">More</span>
        </button>
        <div popover="auto" id="settings" className='w-2xs aspect-square bg-black text-white [position-anchor:--moreLinksDialog-anchor] [top:anchor(top)] -translate-y-11/10 translate-x-3/4 rounded-xl shadow-even'></div>
    </div>
  )
}
