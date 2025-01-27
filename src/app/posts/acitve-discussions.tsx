"use client";

import React from "react";
import Image from "next/image";
import { HomepageEntryData, SortKey } from "@/helpers/types";
import { getSortedPosts } from "@/helpers/utils";
import { PostsCard } from "../components/client/post-card";

export const ActiveDiscussions = ({ posts }: { posts: (HomepageEntryData & { firstPostDate: string; lastPostDate: string })[] }) => {
  const [sortKey, setSortKey] = React.useState<SortKey>("newest");
  const [openPopUp, setOpenPopUp] = React.useState<boolean>(false);

  const memoizedPosts = React.useMemo(() => getSortedPosts(posts, sortKey), [posts, sortKey]);

  return (
    <div className='flex flex-col gap-6 max-w-[866px] mx-auto '>
      <section className='text-base font-gt-walsheim leading-[22.56px] flex items-center gap-4 justify-between'>
        <section className='flex items-center gap-2'>
          <button
            className='text-base leading-[22.56px] capitalize text-white bg-orange-custom-100 px-2 py-[2px] rounded-full'
            onClick={() => setSortKey("all")}
          >
            All
          </button>
          <button
            className='hidden sm:flex items-center gap-1 bg-gray-custom-1000 rounded-full px-2 py-[2.5px] w-fit'
            onClick={() => setSortKey("delvingbitcoin")}
          >
            <Image src={`/icons/delvingbitcoin_icon.svg`} width={20} height={20} alt='' />
            <p className='text-base leading-[22.56px] capitalize'>Delving Bitcoin</p>
          </button>
          <button
            className='hidden sm:flex items-center gap-1 bg-gray-custom-1000 rounded-full px-2 py-[2.5px] w-fit'
            onClick={() => setSortKey("bitcoin-dev")}
          >
            <Image src={`/icons/bitcoin-dev_icon.svg`} width={20} height={20} alt='' />
            <p className='text-base leading-[22.56px] capitalize'>Bitcoin Dev</p>
          </button>
        </section>

        <div className='flex items-center gap-4 relative'>
          <button
            className='text-base leading-[22.56px] border border-black px-4 py-[3px] rounded-full flex items-center gap-2'
            onClick={() => setOpenPopUp(!openPopUp)}
          >
            <span>
              <Image src={`/icons/sort-icon.svg`} width={16} height={17} alt='' />
            </span>
            Sort by
          </button>

          {openPopUp && (
            <section className='flex flex-col gap-3 bg-white p-6 rounded absolute top-10 right-0 shadow-sm border border-gray-custom-200'>
              <p className='text-base leading-[22.56px]'>Sort by</p>
              <section className='flex items-center gap-4'>
                <button
                  className={`px-4 py-1 rounded-full text-sm text-nowrap leading-[19.74px]  ${
                    sortKey === "newest" ? "bg-orange-custom-100 text-white" : "bg-gray-custom-1000 text-black"
                  }`}
                  onClick={() => setSortKey("newest")}
                >
                  Newest First
                </button>
                <button
                  className={`px-4 py-1 rounded-full text-sm text-nowrap leading-[19.74px]  ${
                    sortKey === "oldest" ? "bg-orange-custom-100 text-white" : "bg-gray-custom-1000 text-black"
                  }`}
                  onClick={() => setSortKey("oldest")}
                >
                  Oldest First
                </button>
              </section>
            </section>
          )}
        </div>
      </section>

      <div className='flex items-center justify-between max-w-[866px] mx-auto w-full h-full'>
        <section className='flex flex-col gap-4 md:gap-6 pb-[44px]'>
          {!memoizedPosts.length ? (
            <p>Oops! No ongoing discussions this week. Check out the new posts above.</p>
          ) : (
            memoizedPosts.map((entry, index) => {
              return <PostsCard entry={entry} key={`${entry.id}-${index}`} />;
            })
          )}
        </section>
      </div>
    </div>
  );
};
