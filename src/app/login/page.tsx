import { loginAction } from "@/next-js/server-action/actions";
import GitHubIcon from "@/next-js/components/svg/GitHubIcon";
import NextIcon from "@/next-js/components/svg/NextIcon";

export default async function Login() {
  return (
    <section className="h-screen flex justify-center items-center">
        <div className="flex flex-col items-center p-8 w-sm rounded-xl bg-black text-white dark:bg-white dark:text-black shadow-even dark:shadow-white shadow-black">
        <NextIcon width={65} height={65}/>
        <h1 className="text-2xl mt-2 font-bold">SignIn to Twitter Clone</h1>
        <p className="my-1 font-normal">Welcome back! Please SignIn to continue</p>
        <form action={loginAction} className="mt-4">
            <button type="submit" className="flex items-center justify-center gap-x-1 px-8 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors shadow-even shadow-blue-400 cursor-pointer">
                <GitHubIcon />
                <span className="font-medium text-white">GitHub</span>
            </button>
        </form>
        </div>
    </section>
  );
}
