import { getRelativePathFromInternalLink } from "@/app/components/server/actions/summary-data";
import React from "react";
import { sortedAuthorData } from "../page";
import Link from "next/link";

const DiscussionHistory = ({
  historyLinks,
  authors,
}: {
  historyLinks: string[];
  authors: sortedAuthorData[];
}) => {

  console.log({historyLinks})
  return (
    <div className="relative">
      <h2 className="font-inika text-3xl sticky top-[76px] py-6 bg-gradient-to-b from-[#fff] via-[#fff] via-70% to-[rgba(256,0,0, 1)] z-10 border-t-2">
        Discussion History
      </h2>
      <div className="">
        {historyLinks.map((link, index) => {
          return (
            <SingleHistoryThread
              key={index}
              index={index}
              historyLink={link}
              author={authors[index]}
              length={historyLinks.length}
            />
          );
        })}
      </div>
    </div>
  );
};

const SingleHistoryThread = ({
  historyLink,
  author,
  index,
  length,
}: {
  historyLink: string;
  author: sortedAuthorData;
  index: number;
  length: number;
}) => {
  const path = getRelativePathFromInternalLink(historyLink);
  const dateObj = new Date(author.dateInMS);
  const dateDisplay = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(dateObj);
  return (
    <div key={index} className="flex relative pb-8 gap-4">
      {length - 1 !== index && (
        <div className="absolute bg-gray-200 left-4 -translate-x-1/2 z-[-1] top-0 w-1 h-full"></div>
      )}
      <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
        <span>{index}</span>
      </div>
      <div>
        <div className="flex gap-2">
          <Link href={path}>
            <span className="pb-[2px] border-b-2 border-brand-secondary leading-relaxed text-brand-secondary font-semibold">
              {author?.name ?? "regex fail placeholder name"}
            </span>
          </Link>
          {index === 0 && (
            <span className="py-1 px-1 font-inika text-sm bg-yellow-100 text-gray-900">
              Original Post
            </span>
          )}
        </div>
        <div className="py-2">
          {dateDisplay ?? "regex fail placeholder date"}
        </div>
      </div>
    </div>
  );
};

export default DiscussionHistory;
