"use client"
import { useId, useState } from "react"
import CheckedIcon from "../svg/CheckedIcon";
import { SvgIconProps } from "../svg/type-utility/iconTypes";
import ProfileIcon from "../svg/client-svg/ProfileIcon";
import Publicicon from "../svg/client-svg/Publicicon";
import VerifiedIcon from "../svg/client-svg/VerifiedIcon";
import AtIcon from "../svg/client-svg/AtIcon";


type OptionsType = "Everyone can reply" | "Accounts you follow" | "Verified accounts" | "Only accounts you mention";
type SelectOptionsType = {
    value: OptionsType;
    Icon: ({ width, height, className }: SvgIconProps) => React.JSX.Element;
}

const options: SelectOptionsType[] = [
    {value: "Everyone can reply", Icon: Publicicon},
    {value: "Accounts you follow", Icon: ProfileIcon},
    {value: "Verified accounts", Icon: VerifiedIcon},
    {value: "Only accounts you mention", Icon: AtIcon},
]

type VisibilityDailogProps = {
  positionValue: string
}

export default function VisibilityDailog({positionValue}: VisibilityDailogProps) {
    const [state, setState] = useState<OptionsType>("Everyone can reply");
    const id = useId();
    const anchor = {
      anchorName: `--${id}-anchor`
    }
    const position = {
      positionAnchor: `--${id}-anchor`,
      positionArea: positionValue
    }
  return (
    <div>
      <button type="button" popoverTarget={id} className="text-blue-500 p-4 pt-0" style={anchor as any}>{state}</button>
      <input type="text" name="visibility" value={state} readOnly={true} hidden/>
      <div popover="auto" id={id} className="w-2xs bg-black text-white rounded-xl shadow-even text-sm" style={position as any}>
        <div className="p-4">
            <h1 className="font-semibold text-base">Who can reply?</h1>
            <p className="text-gray-500 leading-5">Choose who can reply to this post. Anyone mentioned can always reply.</p>
        </div>
        {options.map(({value, Icon}) => (
            <button key={value} type="button" popoverTarget={id} onClick={() => {setState(value)}} className="px-4 py-3 flex items-center hover:bg-lighthover transition-colors w-full">
                <Icon className="p-2 rounded-full bg-blue-500" width={40} height={40}/>
                <span className="font-extrabold mx-3 text-left">{value}</span>
                <CheckedIcon className={`ml-auto ${state === value ? "fill-blue-500" : "fill-transparent"}`}/>
            </button>
        ))}
      </div>
    </div>
  )
}
