import Image from "next/image";
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
  link,
  length,
}: {
  author: sortedAuthorData;
  index: number;
  originalPostLink:string;
  length: number;
  isPostSummary : boolean;
  setIsReplyOpen: Dispatch<SetStateAction<{
    [key: string]: boolean;
}>>;
  currentReplyUrl: string
  link: string;
}) => {


  // The regex is looking for a .xml at the end of the string
  // If it finds it, it will replace it with an empty string
  const path = link.replace(/\.xml$/, "");
  const dateObj = new Date(author.dateInMS);
  const dateString = dateObj.toISOString();

  const formattedTime = getUtcTime(dateString);

  const hexLink = stringToHex(path)

  const isActive = isPostSummary ? false : hexLink === currentReplyUrl;
  
  return (
    <div className='flex items-start w-full'>
      <Link
      onClick={()=>{index === 0 && setIsReplyOpen({[length]:false}) }}
      href={`/posts/${originalPostLink}-${hexLink}`}
        className={`flex gap-1 p-2 rounded-lg items-start w-full max-w-[373px] cursor-pointer ${isActive ? "bg-black" : ""}`}
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
            </p>
          </section>
        </div>
      </Link>
    </div>
  );
};
