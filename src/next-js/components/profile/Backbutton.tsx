"use client"

import { useRouter } from "next/navigation"
import ArrowLeftIcon from "../svg/client-svg/ArrowLeft";

export default function Backbutton() {
    const router = useRouter();
  return (
    <button
      type="button"
      className="p-2 rounded-full hover:bg-lighthover cursor-pointer"
      onClick={() => {router.back()}}
    >
      <ArrowLeftIcon />
    </button>
  );
}
