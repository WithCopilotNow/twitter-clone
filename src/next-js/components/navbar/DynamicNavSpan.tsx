"use client"
import { usePathname } from "next/navigation"

type DynamicNavSpanProps = {
    url: string,
    text: string,
    className?: string,
}

export default function DynamicNavSpan({ url, text, className }: DynamicNavSpanProps) {
    const path = usePathname();
    return <span className={`${path === url ? `font-bold ${className}` : ""}`}>{text}</span>
}
