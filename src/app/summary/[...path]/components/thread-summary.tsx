"use client";

import Image from "next/image";
import { useState } from "react";
import { PostSummaryData } from "@/helpers/types";
import { sortedAuthorData } from "@/helpers/types";
import { formatDateString, getUtcTime } from "@/helpers/utils";
import { ThreadIcon } from "@/public/icons/thread-icon";
import { useCallback } from "react";
import { MarkdownWrapper } from "@/app/components/server/MarkdownWrapper";
import { ThreadReply } from "./thread-reply";
import Link from "next/link";

export const ThreadSummary = ({
  summaryData,
  originalPostLink,
  currentReplyLink,
  currentReplyData,
  isPostSummary,
  params,
  children,
}: {
  summaryData: PostSummaryData;
  currentReplyData?: PostSummaryData;
  originalPostLink: string;
  isPostSummary ?: boolean;
  currentReplyLink?: string;
  params: {
    path: string[];
  };
  children?: React.ReactNode;
}) => {
  const {
    title,
    authors,
    historyLinks,
    entry: { summary },
  } = summaryData.data;

  const splitSentences = summary.split(/(?<=[.!?])\s+/);
  const firstSentence = splitSentences[0];
 
  const newSummary = summary.replace(firstSentence, "");

  const [isReplyOpen, setIsReplyOpen] = useState<{ [key: string]: boolean }>({
    "0": false,
  });
  const currentReply = currentReplyData?.data;

  const correctedTitle = title.replace("Combined summary - ", "");

  /**
   * get breadcrumb data
   */
  const postBreadcrumbData = () => {
    /**
     * routes to account for:
     * - Home
     * - dev_name
     * - topic
     * - Thread Summary
     * - Authors
     */

    const devName = params.path[0];
    const trimmedTitle = `${correctedTitle.substring(0, 30)}...`;

    const displayedAuthor = currentReply?.authors[0].name ?? "";

    const routes = [
      {
        name: "Home",
        link: "/",
      },
      {
        name: devName,
        link: `/posts?source=all-activity&dev=${devName}`,
      },
      {
        name: isPostSummary || displayedAuthor ? trimmedTitle : correctedTitle,
        link: `/summary/${params.path.join("/")}`,
      },
      displayedAuthor && !isPostSummary
        ? {
            name: (
              <span
                className={`${
                  displayedAuthor
                    ? "text-orange-custom-100"
                    : "text-gray-custom-1100"
                } capitalize`}
              >
                {displayedAuthor}
              </span>
            ),
            link: `#`,
          }
        : { name: null, link: null },
      isPostSummary && !displayedAuthor
        ? {
            name: (
              <span
                onClick={() =>
                  setIsReplyOpen({ [String(historyLinks.length)]: true })
                }
                className={`${
                  isPostSummary
                    ? "text-orange-custom-100"
                    : "text-gray-custom-1100"
                } flex items-center gap-1`}
              >
                <ThreadIcon className="w-4 h-4" /> Thread Summary
              </span>
            ),
            link: `#`,
          }
        : { name: null, link: null },
    ];

    return routes;
  };

  const routes = postBreadcrumbData();

  /**
   * get date range
   */
  const getDateRange = () => {
    const firstAuthor = authors[0];
    const lastAuthor = authors[authors.length - 1];
    const firstAuthorDate = formatDateString(firstAuthor.date, false);
    const lastAuthorDate = formatDateString(lastAuthor.date, true);
    return `${firstAuthorDate} - ${lastAuthorDate}`;
  };

  /**
   * scroll to top of the page
   */
  const scrollToSummary = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onTitleClick = (name: string) => {
    if (name === mainTitle) {
      setIsReplyOpen({ ["0"]: true });
    }
  };

  const displayedAuthor = currentReply?.authors[0].name ?? "";
  const displayedAuthorDate = currentReply?.authors[0].date ?? "";
  const mainTitle = routes[2].name;
  const dateRange = getDateRange();
  const replyDateInMS = currentReply?.authors[0].dateInMS
    ? new Date(currentReply?.authors[0].dateInMS)
    : new Date();
  const replyDateString = replyDateInMS.toISOString();
  const replyTime = getUtcTime(replyDateString);

  return (
    <div>
      {/* breadcrumb */}
      <section className="flex items-center py-6 flex-wrap">
        {routes.map((link, index) => (
          <div key={`${link.link}-${index}`} className="flex items-center">
            {index !== 0 && link.link !== null && (
              <p className="text-gray-custom-1200 px-[5px]">/</p>
            )}
            <Link
              href={link.link ?? "#"}
              onClick={() => onTitleClick(String(link.name))}
              className="text-sm md:text-base font-medium md:font-normal font-gt-walsheim leading-[18.06px] md:leading-[18.32px] text-gray-custom-1100 text-nowrap"
            >
              {link.name}
            </Link>
          </div>
        ))}
      </section>

      <div className="flex flex-col max-w-[866px] mx-auto">
        <section className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-[36px] font-normal font-test-signifier leading-[31.03px] md:leading-[46.55px]">
            {correctedTitle}
          </h1>
          {displayedAuthor && !isPostSummary && (
            <p className="font-gt-walsheim text-base md:text-xl leading-[18.32px] md:leading-[22.9px] font-medium capitalize">
              Posted by {displayedAuthor}
            </p>
          )}

          {displayedAuthorDate && !isPostSummary ? (
            <>
              <p className="font-gt-walsheim text-sm md:text-base leading-[19.74px] md:leading-[22.56px] font-light text-[#8B8B8B]">
                <span>{formatDateString(displayedAuthorDate, true)}</span>
                <span className="px-2">/</span>
                <span>{replyTime}</span>
              </p>
            </>
          ) : (
            <p className="font-gt-walsheim text-sm md:text-base leading-[19.74px] md:leading-[22.56px] font-light text-[#8B8B8B]">
              {dateRange}
            </p>
          )}
        </section>

        {/* Summary / Replies display section */}
        <section className={"py-6"}>
          <div className="flex flex-col gap-6">
            {isPostSummary && (
              <section className="bg-orange-custom-200 rounded-lg p-5 py-6 md:p-6 w-full border-l-2 border-l-orange-custom-100 flex flex-col gap-2">
                <aside className="flex items-center gap-1">
                  <Image
                    src="/icons/page-icon.svg"
                    alt="page icon"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <p className="text-lg font-gt-walsheim leading-[22.9px] font-medium">
                    At a Glance
                  </p>
                </aside>

                <ul className="list-disc pl-6">
                  <li className="list-disc">
                    <span className="font-normal text-sm md:text-base font-gt-walsheim leading-[18.32px] md:leading-[18.32px]">
                      {firstSentence}
                    </span>
                  </li>
                </ul>
              </section>
            )}
            {children && children}
            <section className="max-w-[712px] mx-auto">
              {isPostSummary ? (
                <MarkdownWrapper
                  className="font-gt-walsheim text-sm md:text-base leading-8 md:leading-[22.56px] font-normal"
                  summary={newSummary}
                />
              ) : (
                <MarkdownWrapper
                  className="font-gt-walsheim text-sm md:text-base leading-8 md:leading-[22.56px] font-normal"
                  summary={currentReply?.entry.summary || ""}
                />
              )}
            </section>

            {currentReply?.generatedUrl && !isPostSummary && (
              <section className="flex justify-center">
                <Link
                  href={currentReply?.generatedUrl || ""}
                  target="_blank"
                  className="text-sm font-medium font-gt-walsheim leading-[19.74px] py-1.5 px-4 bg-gray-custom-700 rounded-full p-2 w-fit underline"
                >
                  Link to Raw Post
                </Link>
              </section>
            )}
          </div>
        </section>

        <div className="bg-orange-custom-200 rounded-lg p-4 py-6 md:p-6 w-full">
          {/* Thread summary control */}
          <Link
            href={`/posts/${originalPostLink}-${currentReplyLink||""}/summary`}
            className={`flex flex-col gap-1 w-full max-w-[381px] rounded-lg p-2 justify-between items-start ${
              isPostSummary ? "bg-black" : ""
            }`}
          >
            <section className="flex items-center gap-1">
              <ThreadIcon
                className={`w-5 h-5 ${
                  isPostSummary ? "text-orange-custom-100" : "text-black"
                }`}
              />
              <p
                className={`text-sm md:text-lg font-test-signifier leading-[18.1px] md:leading-[23.27px] underline ${
                  isPostSummary ? "text-orange-custom-100" : "text-black"
                }`}
              >
                Thread Summary ({(historyLinks.length || 1) - 1} replies)
              </p>
            </section>
            <p
              className={`font-gt-walsheim text-sm md:text-base leading-[19.74px] md:leading-[22.56px] font-light ${
                isPostSummary ? "text-orange-custom-100" : "text-[#8B8B8B]"
              }`}
            >
              {dateRange}
            </p>
          </Link>

          <section className="border-b border-[#979797] my-2"></section>

          {/* Thread Replies */}
          <section className="flex flex-col gap-2">
            {historyLinks.map((link, index) => (
              <ThreadReply
                key={index}
                setIsReplyOpen={setIsReplyOpen}
                author={authors[index]}
                index={index}
                currentReplyUrl={currentReplyLink || ""}
                originalPostLink={originalPostLink}
                length={historyLinks.length}
                link={link}
                isPostSummary={isPostSummary || false}
              />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};
