"use client";

import { useActionState, useRef, useState } from "react";
import SearchIcon from "../svg/client-svg/SearchIcon";
import { searchAction } from "@/next-js/server-action/actions";
import { DbUserType } from "@/models/user";
import { useRouter } from "next/navigation";

const initialState: DbUserType[] = [];

export default function Search() {
  const router = useRouter();
  const subBtnRef = useRef<HTMLButtonElement | null>(null);
  const [dbUsers, formAction, isPending] = useActionState(searchAction, initialState);
  const [search, setSearch] = useState<string>("");
  const anchor = {
    anchorName: "--search-anchor"
  }
  const position = {
    positionAnchor: "--search-anchor",
    positionArea: "bottom center"
  }
  return (
    <div className="sticky top-0 w-full bg-black group z-10 pt-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <form
        action={formAction}
        className="flex items-center border-2 border-solid border-lighthover rounded-full pl-4 focus-within:border-2 focus-within:border-blue-400 z-10"
        style={anchor as any}
      >
        <label htmlFor="search">
          <SearchIcon width={20} height={20} />
        </label>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search"
          autoComplete="off"
          className="grow p-2 pr-4 outline-none"
          value={search}
          onInput={(event) => {
            setSearch(event.currentTarget.value);
            subBtnRef.current?.click();
          }}
        />
        <button type="submit" hidden ref={subBtnRef}></button>
      </form>
      <div className="fixed hidden group-focus-within:block hover:block starting:opacity-0 transition-opacity delay-100 w-xs min-h-40 bg-black text-white rounded-xl shadow-even z-10" style={position as any}>
        {isPending ? (
          <div className="w-10 aspect-square rounded-full border-4 border-b-blue-500 border-gray-400 animate-spin mx-auto mt-8"></div>
        ) : (
          <ul>
            {dbUsers.map((user) => (
              <li key={user.githubId}>
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/${user.userId}`);
                  }}
                  className="w-full flex items-center hover:bg-lighthover p-4 rounded-lg"
                >
                  <div className="size-10 rounded-full bg-gray-500 shrink-0 overflow-hidden bg-no-repeat bg-cover" style={{backgroundImage: `url(${user.avatarUrl})` || "https://picsum.photos/seed/picsum/200/300"}}></div>
                  <div className="px-3 text-sm text-left">
                    <h1 className="font-bold">{user.name}</h1>
                    <span className="text-gray-400 font-semibold">{`@${user.userId}`}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
