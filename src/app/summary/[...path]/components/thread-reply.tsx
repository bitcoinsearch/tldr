import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { sortedAuthorData } from "@/helpers/types";
import { formatDateString, getUtcTime } from "@/helpers/utils";

export const ThreadReply = ({
  author,
  replies,
  index,
  isReplyOpen,
  setIsReplyOpen,
  link,
  callback,
}: {
  author: sortedAuthorData;
  replies: string;
  index: number;
  isReplyOpen: { [key: string]: boolean };
  setIsReplyOpen: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  link: string;
  callback: (path: string) => void;
}) => {
  const isOriginalPost = index === 0;

  // The regex is looking for a .xml at the end of the string
  // If it finds it, it will replace it with an empty string
  const path = link.replace(/\.xml$/, "");
  const dateObj = new Date(author.dateInMS);
  const dateString = dateObj.toISOString();

  const formattedTime = getUtcTime(dateString);
  const isActive = isReplyOpen[String(index)];

  return (
    <div className='flex items-start w-full'>
      <button
        onClick={() => {
          setIsReplyOpen({ [String(index)]: true });
          callback(path);
        }}
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
              {isOriginalPost && (
                <p
                  className={`text-xs md:text-sm font-test-signifier leading-[15.52px] md:leading-[18.1px] ${
                    isActive ? "text-orange-custom-100" : "text-black"
                  }`}
                >
                  {replies} replies
                </p>
              )}
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

          {isOriginalPost && (
            <p
              className={`font-gt-walsheim text-xs md:text-sm leading-[16.92px] md:leading-[16.92px] font-normal ${
                isActive ? "text-orange-custom-100" : "text-black"
              }`}
            >
              Original Post
            </p>
          )}
        </div>
      </button>
    </div>
  );
};
