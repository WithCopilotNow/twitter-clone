import Link from "next/link";
import DynamicNavSpan from "../navbar/DynamicNavSpan";

type ProfileNavListType = {
    url: string;
    text: string;
}

type ProfileNavProps = {
  param: string
}

export default async function ProfileNav({param}: ProfileNavProps) {
  const profileNavList: ProfileNavListType[] = [
      { url: `/${param}`, text: "Posts"},
      { url: `/${param}/replies`, text: "Replies"},
      { url: `/${param}/highlights`, text: "Highlights"},
      { url: `/${param}/articles`, text: "Articles"},
      { url: `/${param}/media`, text: "Media"},
      { url: `/${param}/likes`, text: "Likes"},
  ];
  return (
    <div className="w-full">
      <ul className="w-full flex border-b-1 border-lighthover">
        {profileNavList.map(({url, text}) => (
            <li key={text} className="grow-1">
                <Link href={url} className="block py-2 hover:bg-lighthover text-center text-gray-500 rounded-sm">
                    <DynamicNavSpan url={url} text={text} className="border-b-3 border-blue-500 text-white pb-2"/>
                </Link>
            </li>
        ))}
      </ul>
    </div>
  )
}
