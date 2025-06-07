import Link from "next/link";
import MoreOptionsDialog from "./MoreOptionsDialog";

type TrandingDataType = {
    category: string;
    location: string;
    postsSize: number;
    title: string;
};

const dummyTrandingData: TrandingDataType[] = [
    { category: "Politics", location: "india", postsSize: 70250, title: "Sindoor" },
    { category: "", location: "india", postsSize: 11300, title: "A. Starship" },
    { category: "Business & finance", location: "india", postsSize: 9850, title: "Jensen Huang" },
    { category: "Entertainment", location: "india", postsSize: 6750, title: "#TrustTomCruise" },
]

export default async function Trending() {
  return (
    <div className="border-1 border-lighthover rounded-lg overflow-hidden">
      <h1 className="p-4 text-2xl font-bold">Whats happening</h1>
      <ul>
        {dummyTrandingData.map((dummyData) => (
          <li key={dummyData.title}>
            <form action="" className="flex items-center hover:bg-lighthover pr-2">
              <button type="submit" className="text-left text-sm grow-1 text-gray-500 px-5 py-2 cursor-pointer">
                <p>{dummyData.category ? `${dummyData.category} . Tranding` : `Tranding in ${dummyData.location}`}</p>
                <h1 className="text-base font-bold text-white">{dummyData.title}</h1>
                <p>{`${dummyData.postsSize} posts`}</p>
              </button>
              <MoreOptionsDialog />
            </form>
          </li>
        ))}
      </ul>
      <Link href="/explore" className="inline-block text-blue-400 hover:bg-[rgba(100,100,100,0.5)] px-5 py-4 w-full">Show more</Link>
    </div>
  )
}





