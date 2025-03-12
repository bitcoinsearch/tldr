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
  searchParams,
  handleRepliesCallback,
  params,
}: {
  summaryData: PostSummaryData;
  searchParams: {
    replies: string;
  };
  handleRepliesCallback: (path: string) => Promise<PostSummaryData | null>;
  params: {
    path: string[];
  };
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

  const [isReplyOpen, setIsReplyOpen] = useState<{ [key: string]: boolean }>({ "0": false });
  const [replySummary, setReplySummary] = useState<{ summary: string; generatedUrl: string; author: Partial<sortedAuthorData> }>({
    summary: "",
    generatedUrl: "",
    author: {},
  });

  const isPostSummary = isReplyOpen[String(historyLinks.length)];
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

    const displayedAuthor = replySummary.author.name;


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
        name:isPostSummary || replySummary.author.name ? trimmedTitle : correctedTitle,
        link: `/summary/${params.path.join("/")}?replies=${searchParams.replies}`,
      },
      replySummary.author.name && !isPostSummary
        ? {
            name: (
              <span className={`${replySummary.author.name ? "text-orange-custom-100" : "text-gray-custom-1100"} capitalize`}>{displayedAuthor}</span>
            ),
            link: `#`,
          }
        : { name: null, link: null },
      isPostSummary || replySummary.author.name
        ? {
            name: (
              <span
                onClick={() => setIsReplyOpen({ [String(historyLinks.length)]: true })}
                className={`${isPostSummary ? "text-orange-custom-100" : "text-gray-custom-1100"} flex items-center gap-1`}
              >
                <ThreadIcon className='w-4 h-4' /> Thread Summary
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

  /**
   * @param path
   * @returns author reply summary data
   */
  const getReplyData = async (path: string) => {
    const summaryData = await handleRepliesCallback(path);
    if (!summaryData) return;
    const {
      entry: { summary },
      generatedUrl,
      authors,
    } = summaryData.data;

    setReplySummary({ summary, generatedUrl: generatedUrl || "", author: authors[0] });
    scrollToSummary();
  };
  const onTitleClick = (name: string)=>{
    if (name === mainTitle) {
      setIsReplyOpen({ ["0"]: true });
      setReplySummary((prev)=>({generatedUrl:"", summary:"", author:{}}));
  }}

  const mainTitle = routes[2].name;
  const dateRange = getDateRange();
  const replyDateInMS = replySummary.author.dateInMS ? new Date(replySummary.author.dateInMS) : new Date();
  const replyDateString = replyDateInMS.toISOString();
  const replyTime = getUtcTime(replyDateString);

  return (
    <div>
      {/* breadcrumb */}
      <section className='flex items-center py-6 flex-wrap'>
        {routes.map((link, index) => (
          <div key={`${link.link}-${index}`} className='flex items-center'>
            {index !== 0 && link.link !== null && <p className='text-gray-custom-1200 px-[5px]'>/</p>}
            <Link
              href={link.link ?? "#"}
              onClick={() =>onTitleClick(String(link.name)) }
              className='text-sm md:text-base font-medium md:font-normal font-gt-walsheim leading-[18.06px] md:leading-[18.32px] text-gray-custom-1100 text-nowrap'
            >
              {link.name}
            </Link>
          </div>
        ))}
      </section>

      <div className='flex flex-col max-w-[866px] mx-auto'>
        <section className='flex flex-col gap-4'>
          <h1 className='text-2xl md:text-[36px] font-normal font-test-signifier leading-[31.03px] md:leading-[46.55px]'>{correctedTitle}</h1>
          {replySummary.author.name && !isPostSummary && (
            <p className='font-gt-walsheim text-base md:text-xl leading-[18.32px] md:leading-[22.9px] font-medium capitalize'>
              Posted by {replySummary.author.name}
            </p>
          )}

          {replySummary.author.date && !isPostSummary ? (
            <>
              <p className='font-gt-walsheim text-sm md:text-base leading-[19.74px] md:leading-[22.56px] font-light text-[#8B8B8B]'>
                <span>{formatDateString(replySummary.author.date, true)}</span>
                <span className='px-2'>/</span>
                <span>{replyTime}</span>
              </p>
            </>
          ) : (
            <p className='font-gt-walsheim text-sm md:text-base leading-[19.74px] md:leading-[22.56px] font-light text-[#8B8B8B]'>{dateRange}</p>
          )}
        </section>

        {/* Summary / Replies display section */}
        <section className={"py-6"}>
          <div className='flex flex-col gap-6'>
            {isPostSummary && (
              <section className='bg-orange-custom-200 rounded-lg p-5 py-6 md:p-6 w-full border-l-2 border-l-orange-custom-100 flex flex-col gap-2'>
                <aside className='flex items-center gap-1'>
                  <Image src='/icons/page-icon.svg' alt='page icon' width={20} height={20} className='w-5 h-5' />
                  <p className='text-lg font-gt-walsheim leading-[22.9px] font-medium'>At a Glance</p>
                </aside>

                <ul className='list-disc pl-6'>
                  <li className='list-disc'>
                    <span className='font-normal text-sm md:text-base font-gt-walsheim leading-[18.32px] md:leading-[18.32px]'>{firstSentence}</span>
                  </li>
                </ul>
              </section>
            )}

            <section className='max-w-[712px] mx-auto'>
              {isPostSummary ? (
                <MarkdownWrapper className='font-gt-walsheim text-sm md:text-base leading-8 md:leading-[22.56px] font-normal' summary={newSummary} />
              ) : (
                <MarkdownWrapper
                  className='font-gt-walsheim text-sm md:text-base leading-8 md:leading-[22.56px] font-normal'
                  summary={replySummary.summary}
                />
              )}
            </section>

            {replySummary.generatedUrl && !isPostSummary && (
              <section className='flex justify-center'>
                <Link
                  href={replySummary.generatedUrl}
                  target='_blank'
                  className='text-sm font-medium font-gt-walsheim leading-[19.74px] py-1.5 px-4 bg-gray-custom-700 rounded-full p-2 w-fit underline'
                >
                  Link to Raw Post
                </Link>
              </section>
            )}
          </div>
        </section>

        <div className='bg-orange-custom-200 rounded-lg p-4 py-6 md:p-6 w-full'>
          {/* Thread summary control */}
          <button
            onClick={() => {
              setIsReplyOpen({ [String(historyLinks.length)]: true });
              scrollToSummary();
            }}
            className={`flex flex-col gap-1 w-full max-w-[381px] rounded-lg p-2 justify-between items-start ${isPostSummary ? "bg-black" : ""}`}
          >
            <section className='flex items-center gap-1'>
              <ThreadIcon className={`w-5 h-5 ${isPostSummary ? "text-orange-custom-100" : "text-black"}`} />
              <p
                className={`text-sm md:text-lg font-test-signifier leading-[18.1px] md:leading-[23.27px] underline ${
                  isPostSummary ? "text-orange-custom-100" : "text-black"
                }`}
              >
                Thread Summary ({searchParams.replies} replies)
              </p>
            </section>
            <p
              className={`font-gt-walsheim text-sm md:text-base leading-[19.74px] md:leading-[22.56px] font-light ${
                isPostSummary ? "text-orange-custom-100" : "text-[#8B8B8B]"
              }`}
            >
              {dateRange}
            </p>
          </button>

          <section className='border-b border-[#979797] my-2'></section>

          {/* Thread Replies */}
          <section className='flex flex-col gap-2'>
            {historyLinks.map((link, index) => (
              <ThreadReply
                key={index}
                author={authors[index]}
                replies={searchParams.replies}
                index={index}
                link={link}
                isReplyOpen={isReplyOpen}
                setIsReplyOpen={setIsReplyOpen}
                callback={getReplyData}
              />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};
