import { SvgIconProps } from "./type-utility/iconTypes";

export default function LeftArrowIcon({width = 24, height = 24, className = ""}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF" width={`${width}px`} height={`${height}px`} className={className}>
        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
    </svg>
  )
}
