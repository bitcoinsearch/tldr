import { HomepageEntryData } from "@/helpers/types";
import { formattedDate } from "@/helpers/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getRouteFromPath } from "./actions/summary-data";

const Post = ({
  entry,
  isActivePost,
}: {
  entry: HomepageEntryData;
  isActivePost: boolean;
}) => {
  const type = entry.dev_name;
  const path = `summary/${getRouteFromPath(entry.file_path)}`;
  const publishedAtDateDisplay = formattedDate(entry.published_at);
  return (
    <article className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col md:gap-2">
        <div className="flex items-center gap-2">
          <Image
            src={`/icons/${type}_icon.svg`}
            width={16}
            height={16}
            alt=""
          />
          <p className="font-semibold">{type}</p>
        </div>
        <Link href={path}>
          <p className="font-inika text-lg md:text-2xl underline">
            {entry.title}
          </p>
        </Link>
      </div>
      {isActivePost ? (
        <p className="font-inter text-sm md:text-base font-bold hover:text-slate-600 hover:underline hover:underline-offset-2">
          <Link href={`/${path}/#discussion-history`}>
            {entry.n_threads} replies
          </Link>
        </p>
      ) : (
        <p className="font-inter text-sm md:text-base font-bold">
          Posted {publishedAtDateDisplay}
        </p>
      )}
      <div className="grid grid-cols-2 text-sm">
        <div className="flex basis-1/3 flex-col gap-1">
          <p className="font-semibold">Authored by</p>
          <p className="">{entry.authors[0]}</p>
        </div>
        <ContributorsList contributors={entry.contributors} />
      </div>
      <div>
        <SummaryList summary={entry.summary} />
      </div>
      <hr className="my-6" />
    </article>
  );
};

export default Post;

export const ContributorsList = ({
  contributors,
}: {
  contributors: string[];
}) => {
  // If contributors array is empty or undefined, return null so nothing is rendered
  if (!contributors || contributors.length === 0) {
    return null;
  }

  const finalList = contributors.slice(0, 2);
  return (
    <div className="flex basis-2/3 flex-col gap-1">
      <p className="font-semibold involving">Involving</p>
      <p className="inline-flex gap-x-2 flex-wrap text-gray-600">
        {finalList.map((contributor, index) => {
          // if it's the last item, don't add a comma
          const addComma = index < finalList.length - 1 ? ", " : "";
          return (
            <span key={index} className="">{` ${contributor}${addComma}`}</span>
          );
        })}
        {contributors.length > 2 && (
          <span>+{contributors.length - 2} others</span>
        )}
      </p>
    </div>
  );
};

export const SummaryList = ({ summary }: { summary: string }) => {
  const items: string[] = summary
    .split("- ")
    .filter((item: string) => item.trim() !== "");

  if (!summary.startsWith("-")) {
    return <p>{summary}.</p>;
  }

  return (
    <ul className="list-disc pl-4 flex flex-col gap-1">
      {items.map((item: string, index: number) => (
        <li key={index}>{item.trim()}</li>
      ))}
    </ul>
  );
};
