import { SvgIconProps } from "../type-utility/iconTypes";

export default function SearchIcon({width = 24, height = 24, className = ""}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={`${width}px`} height={`${height}px`} className={className}>
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  )
}
