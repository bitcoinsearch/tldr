"use client";

import { HomepageEntryData, SortKey } from "@/helpers/types";
import Image from "next/image";
import React from "react";
import { shuffle } from "@/helpers/utils";
import historicalConversations from "../../../public/historical.json"
import { PostsCard } from "../components/client/post-card";
const HistoricConversations = ({
  posts,
  dev,
}: {
  posts: (HomepageEntryData & {
    firstPostDate: string;
    lastPostDate: string;
  })[];
  dev?: SortKey;
}) => {
  const [memoizedPosts, setMemoizedPosts] = React.useState(posts.slice(0, 20));

  const randomizePosts = () => {
    setMemoizedPosts(shuffle(posts).slice(0, 20));
  };

 
  return (
    <div className="flex flex-col gap-6 max-w-[866px] mx-auto ">
      <div className="flex items-end justify-end w-ful">
        <button
          className="text-base leading-[22.56px] font-gt-walsheim border border-black px-4 py-[3px] rounded-full flex items-center gap-2"
          onClick={randomizePosts}
        >
          <span>
            <Image
              src={`/icons/randomise-icon.svg`}
              width={16}
              height={17}
              alt=""
            />
          </span>
          Randomise
        </button>
      </div>

      <div className="flex items-center justify-between max-w-[866px] mx-auto w-full h-full">
        <section className="flex flex-col gap-4 md:gap-6 pb-[44px]">
   {!memoizedPosts.length ? (
            <p>
              Oops! No ongoing discussions this week. Check out the new posts
              above.
            </p>
          ) : (
            memoizedPosts.map((entry, index) => {
              return <PostsCard entry={entry as any} key={`${entry.id}-${index}`} />;
            })
          )}
        </section>
      </div>
    </div>
  );
};

export default HistoricConversations;
