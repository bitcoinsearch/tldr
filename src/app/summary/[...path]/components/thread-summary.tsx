"use client";

import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import { EntryData } from "@/helpers/types";
import { sortedAuthorData } from "@/helpers/types";
import { formatDateString } from "@/helpers/utils";
import { getRelativePathFromInternalLink } from "@/app/components/server/actions/summary-data";
import { useState } from "react";

type PostSummaryData = {
  data: {
    authors: sortedAuthorData[];
    historyLinks: string[];
    id: string;
    title: string;
    updatedAt: string;
    generatedUrl?: string;
    entry: EntryData;
  };
  month: string;
  year: number;
  path: string | undefined;
};

export const ThreadSummary = ({
  summaryData,
  searchParams,
}: {
  summaryData: PostSummaryData;
  searchParams: {
    replies: string;
  };
}) => {
  const { title, authors, historyLinks } = summaryData.data;
  const [isReplyOpen, setIsReplyOpen] = useState<{ [key: string]: boolean }>({ "0": false });

  const getDateRange = () => {
    const firstAuthor = authors[0];
    const lastAuthor = authors[authors.length - 1];
    const firstAuthorDate = formatDateString(firstAuthor.date, false);
    const lastAuthorDate = formatDateString(lastAuthor.date, true);
    return `${firstAuthorDate} - ${lastAuthorDate}`;
  };

  const dateRange = getDateRange();

  return (
    <div className='flex flex-col max-w-[866px] mx-auto'>
      <h1 className='text-[36px] font-normal font-test-signifier leading-[46.55px]'>{title}</h1>
      <p className='pt-4 pb-6 font-gt-walsheim text-base leading-[22.56px] font-light text-[#8B8B8B]'>{dateRange}</p>
      <div className='bg-orange-custom-200 rounded-lg p-6 w-full'>
        <section className='flex flex-col gap-1 pb-4 border-b border-[#979797]'>
          <section className='flex items-center gap-1'>
            <Image src='/icons/thread-icon.svg' alt='thread summary icon' width={20} height={20} className='w-5 h-5' />
            <Link href='/' className='text-lg font-test-signifier leading-[23.27px] underline'>
              Thread Summary ({searchParams.replies} replies)
            </Link>
          </section>
          <p className='font-gt-walsheim text-base leading-[22.56px] font-light text-[#8B8B8B]'>{dateRange}</p>
        </section>

        <section className='pt-2 flex flex-col gap-2'>
          {historyLinks.map((link, index) => (
            <ThreadReply
              key={index}
              author={authors[index]}
              replies={searchParams.replies}
              index={index}
              link={link}
              isReplyOpen={isReplyOpen}
              setIsReplyOpen={setIsReplyOpen}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

const ThreadReply = ({
  author,
  replies,
  index,
  isReplyOpen,
  setIsReplyOpen,
  link,
}: {
  author: sortedAuthorData;
  replies: string;
  index: number;
  isReplyOpen: { [key: string]: boolean };
  setIsReplyOpen: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  link: string;
}) => {
  const isOriginalPost = index === 0;
  const path = getRelativePathFromInternalLink(link);
  const dateObj = new Date(author.dateInMS);
  const dateString = dateObj.toISOString();

  function getTimeFormat(date: string): string {
    const dateObj = new Date(date);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hourCycle: "h23",
      timeZoneName: "short",
    })
      .format(dateObj)
      .replace("at", "");
    return formattedDate;
  }

  const formattedTime = getTimeFormat(dateString);

  return (
    <button
      onClick={() => setIsReplyOpen({ [String(index)]: !isReplyOpen[String(index)] })}
      className={`flex gap-1 p-2 rounded-lg items-start w-fit cursor-pointer ${isReplyOpen[String(index)] ? "bg-black" : ""}`}
    >
      <section className='pt-[2px]'>
        <Image src='/icons/circular-plus-icon.svg' alt='reply icon' width={16} height={16} className='w-4 h-4' />
      </section>

      <div className='w-full flex min-w-[373px] justify-between'>
        <section className='flex flex-col gap-1'>
          <section className='flex items-center gap-4'>
            <p
              className={`font-test-signifier text-lg font-medium leading-[23.27px] underline capitalize ${
                isReplyOpen[String(index)] ? "text-orange-custom-100" : "text-black"
              }`}
            >
              {author.name}
            </p>
            {isOriginalPost && (
              <p className={`text-sm font-test-signifier leading-[18.1px] ${isReplyOpen[String(index)] ? "text-orange-custom-100" : "text-black"}`}>
                {replies} replies
              </p>
            )}
          </section>
          <p
            className={`font-gt-walsheim text-base leading-[22.56px] font-light ${
              isReplyOpen[String(index)] ? "text-orange-custom-100" : "text-[#8B8B8B]"
            }`}
          >
            <span>{formatDateString(author.date, true)}</span> <span className='px-2'>/</span>
            <span>{formattedTime}</span>
          </p>
        </section>

        {isOriginalPost && (
          <p
            className={`font-gt-walsheim text-sm leading-[16.92px] font-normal ${
              isReplyOpen[String(index)] ? "text-orange-custom-100" : "text-black"
            }`}
          >
            Original Post
          </p>
        )}
      </div>
    </button>
  );
};
