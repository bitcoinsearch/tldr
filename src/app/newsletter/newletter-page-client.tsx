"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { NewsletterData } from "@/helpers/types";
import { usePaginatedResult } from "../components/client/hooks/use-pagination";
import NewsletterCard from "../components/client/newsletter-card";
import Pagination from "../components/client/Pagination";

const NewsletterPageClient = ({ newsletters }: { newsletters: NewsletterData[] }) => {
  const [sortKey, setSortKey] = React.useState<"newest" | "oldest">("newest");

  const memoizedNewsletters = React.useMemo(() => {
    switch (sortKey) {
      case "newest":
        return newsletters.sort((a, b) => b.issueNumber - a.issueNumber);
      case "oldest":
        return newsletters.sort((a, b) => a.issueNumber - b.issueNumber);
      default:
        return newsletters;
    }
  }, [newsletters, sortKey]);

  const { currentPage, paginatedResult, setCurrentPage } = usePaginatedResult(memoizedNewsletters, 9);
  const pageSize = 9;

  const pages = React.useMemo(() => Math.ceil((memoizedNewsletters?.length ?? 0) / pageSize), [memoizedNewsletters?.length]);

  return (
    <div>
      <div className='pt-5 md:pt-[54px] pb-8'>
        <Link href='/' className='flex items-center gap-2 py-2 px-4 md:px-6 rounded-full border border-black w-fit'>
          <ArrowLeftIcon className='w-5 h-5 md:w-6 md:h-6' strokeWidth={4} />
          <span className='text-sm md:text-base font-medium md:font-normal font-gt-walsheim leading-[18.32px]'>Back Home</span>
        </Link>
      </div>
      <div className='flex flex-col gap-8'>
        <h1 className='text-center text-[32px] md:text-[48px] xl:text-[64px] font-normal font-test-signifier leading-[41.38px] md:leading-[60px] xl:leading-[82.75px]'>
          Latest Bitcoin TLDR Newsletters
        </h1>

        <div className='flex flex-col gap-6'>
          <section className='text-base font-gt-walsheim leading-[22.56px] flex items-center gap-4'>
            <button
              className={` px-4 py-1 rounded-full ${sortKey === "newest" ? "bg-orange-custom-100 text-white" : "bg-gray-custom-1000 text-black"}`}
              onClick={() => setSortKey("newest")}
            >
              Newest First
            </button>
            <button
              className={`px-4 py-1 rounded-full ${sortKey === "oldest" ? "bg-orange-custom-100 text-white" : "bg-gray-custom-1000 text-black"}`}
              onClick={() => setSortKey("oldest")}
            >
              Oldest First
            </button>
          </section>

          <>
            {paginatedResult.length === 0 ? (
              <div className='flex items-center justify-center w-full h-full py-16'>
                <p className='text-lg leading-[25.38px] font-gt-walsheim'>No newsletters found</p>
              </div>
            ) : (
              <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xl:gap-6 self-center justify-center'>
                {paginatedResult.map((newsletter) => (
                  <NewsletterCard key={newsletter.issueNumber} {...newsletter} />
                ))}
              </section>
            )}
          </>
        </div>
      </div>

      {paginatedResult.length && (
        <div className='flex justify-center items-center pt-10 md:pt-8 pb-[50px]'>
          <div className='bg-white flex flex-wrap overflow-x-auto no-scrollbar max-w-2xl max-md:max-w-full'>
            <Suspense fallback={<div>Loading...</div>}>
              <Pagination currentPage={currentPage} pages={pages} setCurrentPage={setCurrentPage} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterPageClient;
