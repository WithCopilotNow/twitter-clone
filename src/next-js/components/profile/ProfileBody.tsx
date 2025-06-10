import ProfileInfo from "./ProfileInfo";
import Link from "next/link"
import EditProfileDialog from "./EditProfileDialog";
import { DbUserType } from "@/models/User";

type ProfileBodyProps = {
    dbUser: DbUserType
}

export default async function ProfileBody({dbUser}: ProfileBodyProps) {
  const {
    bgUrl,
    avatarUrl,
    name, 
    followers, 
    following, 
    createdAt, 
    userId
  } = dbUser;
  return (
    <div>
      <BackgroundImage bgUrl={bgUrl?.dataUrl} />
      <ProfileImage avatarUrl={avatarUrl} />
      <EditProfileDialog bgUrl={bgUrl?.dataUrl} avatarUrl={avatarUrl} username={name}/>
      <ProfileInfo followers={followers.length} following={following.length} createdAt={createdAt} email={userId}/>
    </div>
  )
}


type BackgroundImageProps = {
    bgUrl: string | undefined,
}

async function BackgroundImage({bgUrl}: BackgroundImageProps) {
    const bgImg = { backgroundImage: `url(${bgUrl})`};
  return (
    <div>
      <Link href="#" className={`block w-full aspect-3/1 bg-cover bg-no-repeat bg-lighthover`} style={bgImg}></Link>
    </div>
  )
}

type ProfileImageProps = {
    avatarUrl: string | undefined
}

async function ProfileImage({avatarUrl}: ProfileImageProps) {
    const bgImg = { backgroundImage: `url(${avatarUrl})`};
  return (
    <div className="p-1 rounded-full bg-black overflow-hidden -translate-y-1/2 max-w-min ml-4 absolute">
      <Link href="#" className={`block size-35 rounded-full bg-[] bg-cover bg-no-repeat bg-lighthover hover:opacity-90`} style={bgImg}></Link>
    </div>
  )
}
