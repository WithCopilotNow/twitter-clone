import Backbutton from "@/next-js/components/profile/Backbutton";

export default function PostLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <div className="flex items-center gap-x-4 px-2 py-1 bg-black sticky top-0 z-10">
        <Backbutton />
        <PostHeader />
      </div>
      {children}
    </>
  )
}


async function PostHeader() {
    return (
        <div>
            <h1 className="text-xl font-semibold">Post</h1>
        </div>
    )
}