import { SvgIconProps } from "./type-utility/iconTypes";

export default async function UploadIcon({width = 24, height = 24, className = ""}: SvgIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF" width={`${width}px`} height={`${height}px`} className={className}>
        <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
    </svg>
  )
}
