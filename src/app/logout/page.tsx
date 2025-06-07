"use client"

import { logoutAction } from "@/next-js/server-action/actions";
import TwitterIcon from "@/next-js/components/svg/client-svg/TwitterIcon";
import { useRouter } from "next/navigation"


export default function Logout() {
    const router = useRouter();
  return (
    <section className="size-full flex items-center justify-center border-l-1 border-lighthover">
      <div className="shadow-even w-80 flex-flex-col p-8 rounded-xl">
        <div className="justify-self-center">
            <TwitterIcon width={50} height={50}/>
        </div>
        <div className="my-5">
            <h1 className="text-xl font-bold mb-1">Log out of X?</h1>
            <p className="text-gray-500 leading-5 text-balance">You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account. </p>
        </div>
        <form action={logoutAction}>
            <button type="submit" className="block w-full px-5 py-2 rounded-full bg-gray-100 text-black mb-3 font-bold hover:bg-gray-300 transition-colors cursor-pointer">Log Out</button>
            <button type="button" className="block w-full px-5 py-2 rounded-full text-gray-100 border-1 border-gray-500 bg-black hover:bg-lighthover transition-colors cursor-pointer" onClick={() => {router.back()}}>Cancel</button>
        </form>
      </div>
    </section>
  )
}
