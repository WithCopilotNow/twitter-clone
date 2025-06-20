import { SvgIconProps } from "./type-utility/iconTypes";

export default async function HomeIcon({width = 24, height = 24, className = ""}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width={`${width}px`} height={`${height}px`} className={className}
        fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
    </svg>
  )
}
