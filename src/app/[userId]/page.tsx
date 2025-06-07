import Profile from "@/next-js/components/profile/Profile";

type UserProfileProps = {
  params: Promise<{userId: string}>
}

export default async function UserProfile({params}: UserProfileProps) {
  const dynamicParamas = await params;
  return (
    <Profile indentity={dynamicParamas.userId}/>
  )
}
