import { SvgIconProps } from "./type-utility/iconTypes";

export default async function EmbedIcon({width = 24, height = 24, className = ""}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={`${width}px`} height={`${height}px`} className={className}>
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
    </svg>
  )
}
