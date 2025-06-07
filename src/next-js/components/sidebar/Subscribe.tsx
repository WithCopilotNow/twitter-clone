import Link from "next/link";

export default async function Subscribe() {
  return (
    <div className="border-1 border-lighthover px-4 py-3 rounded-lg font-bold">
      <h1 className="text-xl mb-2">Subscribe to Premium</h1>
      <p className="text-base text-balance font-light leading-5">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
      <Link href="/premium" className="inline-block px-5 py-2 bg-blue-600 rounded-full mt-3 hover:bg-blue-500 transition-colors cursor-pointer">Subscribe</Link>
    </div>
  )
}

