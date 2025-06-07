import { SvgIconProps } from "../type-utility/iconTypes";

export default function BookmarkIcon({width = 24, height = 24, className = ""}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="#ffff" width={`${width}px`} height={`${height}px`} className={className}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}
