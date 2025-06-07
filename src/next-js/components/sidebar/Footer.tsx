import Link from "next/link"
import MoreHoriIcon from "../svg/MoreHoriIcon"

const footerLinks = ["Terms of Service", "Privacy Policy", "Cookie Policy", "Accessibility", "Ads info"] as const;
const moreLinks = ["About", "Get the x app", "Developer"] as const;

export default async function Footer() {
  const anchor = {
    anchorName: "--moreFooterLinks-anchor"
  }
  const position = {
    positionAnchor: "--moreFooterLinks-anchor",
    positionArea: "top center"
  }
  return (
    <footer className="text-gray-500 px-4 pb-16 text-base">
      {footerLinks.map((links) => (<span key={links} className="w-max">
        <Link href={`/${links.replaceAll(" ", "-").toLowerCase()}`} className="hover:underline inline-block">{links}</Link>
        <span className="mx-4">|</span>
      </span>))}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <button type="button" popoverTarget="moreFooterLinksDialog" className="inline-flex items-center mr-4 cursor-pointer" style={anchor as any}>
        <span className="hover:underline">More</span>
        <MoreHoriIcon width={16} height={16} className="fill-gray-500" />
      </button>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <div popover="auto" id="moreFooterLinksDialog" className="shadow-even bg-black text-white w-max rounded-xl" style={position as any}>
        <ul>
          {moreLinks.map((link) => (
            <li key={link}>
              <Link href={`/${link.replaceAll(" ", "-").toLowerCase()}`} className="inline-block px-4 py-2 hover:bg-lighthover w-full transition-colors">{link}</Link>
            </li>
          ))}
        </ul>
      </div>
      <button type="button">© 2025 X Corp.</button>
    </footer>
  )
}






