import { HomepageEntryData } from "@/helpers/types";
import { formattedDate } from "@/helpers/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getRouteFromPath } from "./actions/summary-data";
import { MarkdownWrapper } from "./MarkdownWrapper";

const Post = ({ entry, isActivePost }: { entry: HomepageEntryData; isActivePost: boolean }) => {
  const type = entry.dev_name;
  const filePath = entry.n_threads !== 0 ? entry.combined_summ_file_path : entry.file_path;
  const path = `summary/${getRouteFromPath(filePath)}`;

  const publishedAtDateDisplay = formattedDate(entry.published_at);

  return (
    <article className='flex flex-col gap-4 mb-8'>
      <div className='flex flex-col md:gap-2'>
        <div className='flex items-center gap-2'>
          <Image src={`/icons/${type}_icon.svg`} width={type === "delvingbitcoin" ? 20 : 16} height={type === "delvingbitcoin" ? 20 : 16} alt='' />
          <p className='font-semibold'>{type}</p>
        </div>
        <Link href={{ pathname: path, query: { replies: entry.n_threads } }}>
          <p className='font-inika text-lg md:text-2xl underline'>{entry.title}</p>
        </Link>
      </div>
      {isActivePost ? (
        <>
          {entry.n_threads !== 0 && (
            <p className='font-inter text-sm md:text-base font-bold hover:text-slate-600 hover:underline hover:underline-offset-2'>
              <Link href={`/${path}/#discussion-history`}>
                {entry.n_threads} {entry.n_threads === 1 ? "reply" : "replies"}
              </Link>
            </p>
          )}
        </>
      ) : (
        <div className='font-inter text-sm md:text-base font-bold '>
          {entry.n_threads !== 0 && (
            <Link href={`/${path}/#discussion-history`} className='hover:text-slate-600 hover:underline hover:underline-offset-2'>
              {entry.n_threads} {entry.n_threads === 1 ? "reply" : "replies"}
            </Link>
          )}
          <p className='mt-[14px]'>Posted {publishedAtDateDisplay}</p>
        </div>
      )}
      <div className='grid grid-cols-2 text-sm'>
        <div className='flex basis-1/3 flex-col gap-1'>
          <p className='font-semibold'>Authored by</p>
          <p className=''>{entry.authors[0]}</p>
        </div>
        <ContributorsList contributors={entry.contributors} />
      </div>
      <div>
        <SummaryList summary={entry.summary} />
      </div>
      <hr className='my-6' />
    </article>
  );
};

export default Post;

export const ContributorsList = ({ contributors }: { contributors: string[] }) => {
  // If contributors array is empty or undefined, return null so nothing is rendered
  if (!contributors || contributors.length === 0) {
    return null;
  }

  const finalList = contributors.slice(0, 2);
  return (
    <div className='flex flex-row gap-1'>
      <p className='flex-wrap'>
        Involving{" "}
        <span className='inline-fle space-x-1 flex-wrap break-words'>
          {finalList.map((contributor, index) => {
            // if it's the last item, don't add a comma
            const addComma = index < finalList.length - 1 ? ", " : "";
            return <span key={index} className=''>{` ${contributor}${addComma}`}</span>;
          })}
          {contributors.length > 2 && (
            <span>
              +{contributors.length - 2} {contributors.length - 2 === 1 ? "other" : "others"}
            </span>
          )}
        </span>{" "}
      </p>
    </div>
  );
};

export const SummaryList = ({ summary }: { summary: string }) => {
  const items: string[] = summary.split("- ").filter((item: string) => item.trim() !== "");

  if (!summary.startsWith("-")) {
    return (
      <MarkdownWrapper
        summary={`${summary}.`}
        className='font-gt-walsheim text-sm md:text-base leading-[19.74px] md:leading-[22.56px] summaryTags break-words'
      />
    );
  }

  return (
    <ul className='list-disc pl-4 flex flex-col gap-1'>
      {items.map((item: string, index: number) => (
        <li key={index} className='break-words text-sm md:text-base font-gt-walsheim leading-[19.74px] md:leading-[22.56px]'>
          <p className='font-gt-walsheim'>{item.trim()}</p>
        </li>
      ))}
    </ul>
  );
};
