import { UserType } from "@/models/user"
import Link from "next/link";

const dummyRecomendations: UserType[] = [
  {
    githubId: "152359",
    name: "User1",
    email: "dummeyuser1",
    avatarUrl: "https://picsum.photos/200/300",
    createdAt: new Date(),
    followers: [],
    following: [],
    postCount: 0
  },
  {
    githubId: "158649",
    name: "User2",
    email: "dummeyuser2",
    avatarUrl: "https://picsum.photos/200/301",
    createdAt: new Date(),
    followers: [],
    following: [],
    postCount: 0
  },
  {
    githubId: "155559",
    name: "User3",
    email: "dummeyuser3",
    avatarUrl: "https://picsum.photos/200/302",
    createdAt: new Date(),
    followers: [],
    following: [],
    postCount: 0
  },
];

export default async function Recomendations() {
  return (
    <div className="border-1 border-lighthover rounded-lg overflow-hidden">
      <h1 className="p-4 text-2xl font-bold">Who to follow</h1>
      <ul>
        {dummyRecomendations.map((recomendation) => (
          <li key={recomendation.githubId} className="flex items-center px-4 py-2">
            <div>
              <Link href={`/${recomendation.email}`}  className="block size-10 rounded-lg bg-lighthover overflow-hidden cursor-pointer bg-no-repeat bg-cover hover:opacity-80 transition-opacity" style={{backgroundImage: `url(${recomendation.avatarUrl})` || undefined}}></Link>
            </div>
            <div className="grow-1 ml-3 cursor-pointer">
              <Link href={`/${recomendation.email}`} className="block font-bold w-max hover:underline">{recomendation.name}</Link>
              <Link href={`/${recomendation.email}`} className="block text-gray-500 w-max">{recomendation.email}</Link>
            </div>
            <form>
              <button type="submit" className="bg-gray-100 text-black px-4 py-1 font-bold rounded-full hover:bg-gray-300 transition-colors cursor-pointer text-sm">Follow</button>
            </form>
          </li>
        ))}
      </ul>
      <Link href="/explore" className="inline-block text-blue-400 hover:bg-lighthover py-4 px-5 w-full">Show more</Link>
    </div>
  )
}
