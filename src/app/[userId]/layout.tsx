import Backbutton from "@/next-js/components/profile/Backbutton";
import ProfileBody from "@/next-js/components/profile/ProfileBody";
import ProfileHeader from "@/next-js/components/profile/ProfileHeader";
import ProfileNav from "@/next-js/components/profile/ProfileNav";
import { getUser } from "@/next-js/server-action/actions";

type ProfileLayoutProps = {
    children: React.ReactNode,
    params: Promise<{userId: string}>
}

export default async function ProfileLayout({children, params}: ProfileLayoutProps) {
  const dynamicParamas = await params;
    const dbUser = await getUser({email: `${dynamicParamas.userId}@gmail.com`});
  return (
    <>
      <div className="flex items-center gap-x-4 px-4 bg-black sticky top-0 z-10">
        <Backbutton />
        <ProfileHeader postCount={dbUser.postCount} name={dbUser.name} />
      </div>
      <ProfileBody dbUser={dbUser}/>
      <ProfileNav param={dynamicParamas.userId}/>
      {children}
    </>
  )
}
