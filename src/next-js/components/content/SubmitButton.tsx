"use client"
import { useFormStatus } from "react-dom"

type SubmitButtonType = {
    text: string,
    pendingText: string,
    className?: string
}

export default function SubmitButton({text, pendingText, className = ""}: SubmitButtonType) {
    const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={className}>{pending ? pendingText : text}</button>
  )
}
