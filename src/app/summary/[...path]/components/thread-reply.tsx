import { Dispatch, SetStateAction } from "react";
import { sortedAuthorData } from "@/helpers/types";
import { formatDateString, getUtcTime, stringToHex } from "@/helpers/utils";
import Link from "next/link";

export const ThreadReply = ({
  author,
  index,
  setIsReplyOpen,
  currentReplyUrl,
  originalPostLink,
  isPostSummary,
  firstPost,
  link,
  length,
}: {
  author: sortedAuthorData;
  index: number;
  originalPostLink:string;
  length: number;
  isPostSummary : boolean;
  firstPost?:string;
  setIsReplyOpen: Dispatch<SetStateAction<{
    [key: string]: boolean;
}>>;
  currentReplyUrl: string
  link: string;
}) => {


  // The regex is looking for a .xml at the end of the string
  // If it finds it, it will replace it with an empty string
  const path = link.replace(/\.xml$/, "");
  const firstPostPath = firstPost?.replace(/\.xml$/, "")
  const dateObj = new Date(author.dateInMS);
  const dateString = dateObj.toISOString();

  const formattedTime = getUtcTime(dateString);

  const hexLink = stringToHex(path)

  // Check if this author has a valid link (XML file available)
  const hasValidLink = link && link.trim() !== "";


  // Only consider active if we have a valid link and it matches the current reply
  const isActive = isPostSummary ? false : (hasValidLink && hexLink === currentReplyUrl);

  const isOriginalPost = firstPostPath && hexLink === stringToHex(firstPostPath);

  // Indentation by depth (new threaded structure)
  const depthPadding = Math.min((author.depth ?? 0) * 20, 200); // increased max limit and adjusted multiplier


  return (
    <div className={`flex items-start  p-2 justify-between rounded-lg max-w-[393px] w-full ${isActive ? isOriginalPost?"bg-black ":"bg-black" : ""} ${!hasValidLink ? "opacity-50" : ""}`} style={{ paddingLeft: depthPadding }}>
      {hasValidLink ? (
        <Link
          onClick={()=>{index === 0 && setIsReplyOpen({[length]:false}) }}
          href={`/posts/${originalPostLink}-${hexLink}`}
          className={`flex gap-1 items-start max-w-[max-content] w-full cursor-pointer`}
        >
          <div className='w-full flex max-w-[373px] justify-between'>
            <section className='flex flex-col gap-1'>
              <section className='flex items-center gap-4'>
                <p
                  className={`font-test-signifier text-sm md:text-lg font-medium leading-[18.1px] md:leading-[23.27px] underline capitalize ${
                    isActive ? "text-orange-custom-100" : "text-black"
                  }`}
                >
                  {author.name}
                </p>

              </section>
              <p
                className={`font-gt-walsheim text-sm md:text-sm leading-[19.74px] md:leading-[22.56px] font-light text-nowrap ${
                  isActive ? "text-orange-custom-100" : "text-[#8B8B8B]"
                }`}
              >
                <span>{formatDateString(author.date, true)}</span> <span className='px-2'>/</span>
                <span>{formattedTime}</span>
                {author.reply_to && (
                  <span className='pl-2'>↳ replying to {author.reply_to}</span>
                )}
              </p>
            </section>
          </div>
        </Link>
      ) : (
        <div className={`flex gap-1 items-start max-w-[max-content] w-full cursor-not-allowed`}>
          <div className='w-full flex max-w-[373px] justify-between'>
            <section className='flex flex-col gap-1'>
              <section className='flex items-center gap-4'>
                <p
                  className={`font-test-signifier text-sm md:text-lg font-medium leading-[18.1px] md:leading-[23.27px] underline capitalize ${
                    isActive ? "text-orange-custom-100" : "text-black"
                  }`}
                >
                  {author.name}
                </p>

              </section>
              <p
                className={`font-gt-walsheim text-sm md:text-sm leading-[19.74px] md:leading-[22.56px] font-light text-nowrap ${
                  isActive ? "text-orange-custom-100" : "text-[#8B8B8B]"
                }`}
              >
                <span>{formatDateString(author.date, true)}</span> <span className='px-2'>/</span>
                <span>{formattedTime}</span>
                {author.reply_to && (
                  <span className='pl-2'>↳ replying to {author.reply_to}</span>
                )}
              </p>
            </section>
          </div>
        </div>
      )}

      {isOriginalPost && <p className={`font-gt-walsheim pt-1 whitespace-nowrap text-xs ${isActive ? "text-orange-custom-100": "text-black"}`}>Original Post</p>}
    </div>
  );
};
