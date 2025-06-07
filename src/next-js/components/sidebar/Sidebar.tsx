import { auth } from "@/auth"

type SidebarProps = {
  children: React.ReactNode
}

export default async function Sidebar({ children }: SidebarProps) {
  const session = await auth();
  return (!session || !session.user) ? undefined : (
    <section className="w-[350px] shrink-0 flex flex-col gap-y-4 max-lg:hidden">
      {children}
    </section>
  )
}
