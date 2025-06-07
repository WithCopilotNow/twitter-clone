import { getUniqueId } from "@/next-js/server-action/actions";
import UploadIcon from "../../svg/UploadIcon";
import CopylinkIcon from "../../svg/CopylinkIcon";
import MessageIcon from "../../svg/MessageIcon";
import { SvgIconProps } from "../../svg/type-utility/iconTypes";

type DummyDataType = {
    text: string;
    Icon: (props: SvgIconProps) => Promise<React.JSX.Element>;
}

const dummyData: DummyDataType[] = [
  {text: "Copy link", Icon: CopylinkIcon},
  {text: "Share post via ...", Icon: UploadIcon},
  {text: "Send via Direct Message", Icon: MessageIcon},
]

export default async function ShareDialog() {
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
      <button type="button" popoverTarget={id} className="p-2 rounded-full hover:bg-lightblue group transition-all relative" style={anchor as any}>
        <UploadIcon width={20} height={20} className="fill-gray-400 group-hover:fill-blue-500 transition-colors"/>
        <span className="hidden absolute bg-gray-600 text-white px-1 rounded-sm -bottom-1/1 left-1/2 -translate-1/2 group-hover:block starting:opacity-0 transition-opacity delay-500">Share</span>
      </button>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <div popover="auto" id={id} className="bg-black text-white rounded-xl shadow-even py-2" style={position as any}>
        <ul>
          {dummyData.map(({text, Icon}) => (
            <li key={text}>
              <button type="button" popoverTarget={id} className="flex items-center gap-x-2 px-4 py-2 hover:bg-lighthover w-full">
                <Icon />
                <span className="w-max">{text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
