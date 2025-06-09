import { getUniqueId } from "@/next-js/server-action/actions";
import EmojiIcon from "../svg/EmojiIcon";
import GifIcon from "../svg/GifIcon";
import GrokIcon from "../svg/GrokIcon";
import ImageIcon from "../svg/ImageIcon";
import PollIcon from "../svg/PollIcon";
import { SvgIconProps } from "../svg/type-utility/iconTypes";

export type UploadMediaType = {
    name: string;
    text: string;
    Icon: ({ width, height, className }: SvgIconProps) => Promise<React.JSX.Element>;
}

const UploadMedia: UploadMediaType[] = [
  {name: "file", text: "Media", Icon: ImageIcon},
  {name: "gif", text: "Gif", Icon: GifIcon},
  {name: "enhance", text: "Enhance your post with Grok", Icon: GrokIcon},
  {name: "poll", text: "Poll", Icon: PollIcon},
  {name: "emoji", text: "Emoji", Icon: EmojiIcon},
]

type MediaContainerProps = {
    className?: string
}

export default async function MediaContainer({
  className = "",
}: MediaContainerProps) {
  return (
    <div className={className}>
      {UploadMedia.map(({ Icon, text, name }, index) => (
          <label
            key={index}
            className="hover:bg-lighthover p-2 rounded-full relative group cursor-pointer"
          >
            <Icon className="fill-blue-500" />
            <span className="absolute -top-3 left-1/2 -translate-1/2 text-sm bg-gray-600 px-1 rounded-xs group-hover:block hidden starting:opacity-0 transition-opacity delay-500 min-w-max">
              {text}
            </span>
             {index === 0 && <input type="file" name={name} hidden accept=".png, .jpg, .jpeg"/>}
          </label>
        )
      )}
    </div>
  );
}
