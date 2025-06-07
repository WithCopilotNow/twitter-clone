import { auth } from "@/auth";
import NavbarBody from "./NavbarBody";
import NavbarFooter from "./NavbarFooter";
import NavbarHeader from "./NavbarHeader";

export default async function Navbar() {
  const session = await auth();
  return (!session || !session.user) ? undefined :  (
    <section className="w-3xs max-xl:w-min h-screen sticky top-0 flex flex-col">
        <NavbarHeader />
        <NavbarBody user={session.user} />
        <NavbarFooter user={session.user}/>
    </section>
  );
}
