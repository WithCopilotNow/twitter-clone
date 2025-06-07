import { getUniqueId } from "@/next-js/server-action/actions"
import CloseIcon from "../svg/CloseIcon";
import SubmitButton from "../content/SubmitButton";
import AddImageIcon from "../svg/AddImageIcon";

type EditProfileDialogProps = {
  bgUrl: string | undefined,
  avatarUrl: string | undefined,
  username: string
}

export default async function EditProfileDialog({bgUrl, avatarUrl, username}: EditProfileDialogProps) {
    const id = await getUniqueId();
    const scrollbar = {
      scrollbarColor: "#636e72 black"
    }
  return (
    <div className="flex justify-end p-4">
      <button type="button" popoverTarget={id} className="px-4 py-1 rounded-full bg-black text-white shadow-even cursor-pointer hover:bg-lighthover">Edit Profile</button>
      <div popover="auto" id={id} className="w-xl max-h-[70dvh] top-1/2 left-1/2 -translate-1/2 shadow-even bg-black text-white backdrop:bg-lightblue rounded-2xl" style={scrollbar as any}>
        <form action="" className="pb-10">
          <FormHeader id={id}/>
          <FormBackgroundImg bgUrl={bgUrl}/>
          <FormProfileImg avatarUrl={avatarUrl}/>
          <div className="w-full min-h-15"></div>
          <section className="flex flex-col gap-y-8 p-5">
            <div className="flex flex-col shadow-even px-2 py-1 group focus-within:shadow-blue-500 rounded-lg">
              <label htmlFor="userName" className="group-focus-within:text-blue-400 text-gray-500">Name</label>
              <input type="text" name="userName" id="userName" defaultValue={username} className="border-none outline-none w-full text-xl"/>
            </div>
            <div className="flex flex-col shadow-even px-2 py-1 group focus-within:shadow-blue-500 rounded-lg">
              <label htmlFor="bio" className="group-focus-within:text-blue-400 text-gray-500">Bio</label>
              <textarea name="bio" id="bio" className="resize-none border-none outline-none w-full text-xl"></textarea>
            </div>
            <div className="flex flex-col shadow-even px-2 py-1 group focus-within:shadow-blue-500 rounded-lg">
              <label htmlFor="location" className="group-focus-within:text-blue-400 text-gray-500">Location</label>
              <input type="text" name="location" id="location" className="border-none outline-none w-full text-xl"/>
            </div>
            <div className="flex flex-col shadow-even px-2 py-1 group focus-within:shadow-blue-500 rounded-lg">
              <label htmlFor="website" className="group-focus-within:text-blue-400 text-gray-500">Website</label>
              <input type="text" name="website" id="website" className="border-none outline-none w-full text-xl"/>
            </div>
            <div className="flex flex-col shadow-even px-2 py-1 group focus-within:shadow-blue-500 rounded-lg">
              <label htmlFor="birthDay" className="group-focus-within:text-blue-400 text-gray-500">BirthDay</label>
              <input type="date" name="birthDay" id="birthDay" className="scheme-dark border-none outline-none text-xl"/>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}

type FormbackgroundImgProps = {
    bgUrl: string | undefined
}
async function FormBackgroundImg({bgUrl}: FormbackgroundImgProps){
  const bgImg = {
    backgroundImage: `url(${bgUrl})`
  }
    return (
        <div className={`w-full aspect-3/1 bg-cover bg-no-repeat relative bg-lighthover`} style={bgImg}>
            <label htmlFor="bgImg" className="absolute top-1/2 left-1/2 -translate-1/2 p-2 rounded-full hover:bg-lighthover cursor-pointer">
                <AddImageIcon />
            </label>
            <input type="file" name="bgImg" id="bgImg" hidden />
        </div>
    )
}

type FormProfileImgProps = {
  avatarUrl: string | undefined
}

async function FormProfileImg({avatarUrl}: FormProfileImgProps){
  const bgImg = {
    backgroundImage: `url(${avatarUrl})`
  }
  return (
    <div className={`size-30 rounded-full border-2 border-black bg-cover bg-no-repeat bg-lighthover ml-4 -translate-y-1/2 absolute`} style={bgImg}></div>
  )
}

type FormHeaderProps = {
  id: string
}

async function FormHeader({id}: FormHeaderProps){
    return (
      <div className="flex items-center gap-x-2 p-2 sticky top-0 backdrop-brightness-20 z-10">
        <button type="button" popoverTarget={id} className="p-2 rounded-full hover:bg-lighthover cursor-pointer">
          <CloseIcon width={20} height={20} /> 
        </button>
        <h1 className="ml-2 text-xl font-semibold">Edit Profile</h1>
        <SubmitButton text="Save" pendingText="Composing" className="ml-auto mr-3 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors cursor-pointer" />
      </div>
    )
}
