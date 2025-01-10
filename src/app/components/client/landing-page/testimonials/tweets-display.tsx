"use client";

import Link from "next/link";
import Image from "next/image";
import { Tweet } from "@/helpers/types";
import React, { useEffect, useState } from "react";
import { MarkdownWrapper } from "@/app/components/server/MarkdownWrapper";

const TweetsDisplay = ({ tweetsFromFile }: { tweetsFromFile: Tweet[] }) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const [sliceIndex, setSliceIndex] = useState(3);

  useEffect(() => {
    const fetchTweets = async () => {
      if (tweetsFromFile.length > 0) {
        setTweets(tweetsFromFile);
        return;
      } else {
        try {
          const response = await fetch("/api/fetchTweets");
          if (!response.ok) {
            throw new Error("Failed to fetch tweets");
          }
          const data: Tweet[] = await response.json();
          setTweets(data);
        } catch (err: any) {
          setError(err.message);
        }
      }
    };

    fetchTweets();
  }, [tweetsFromFile]);

  return (
    <div className='w-full'>
      <div className='columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-[947px] mx-auto w-full'>
        {isMobile
          ? tweets.slice(0, sliceIndex).map((tweet) => (
              <div key={tweet.url} className='mb-4 break-inside-avoid'>
                <TweetCard {...tweet} />
              </div>
            ))
          : tweets.map((tweet) => (
              <div key={tweet.url} className='mb-4 break-inside-avoid'>
                <TweetCard {...tweet} />
              </div>
            ))}
      </div>
      <div className='flex justify-center pt-6'>
        <button
          className='flex md:hidden text-sm font-medium leading-[19.74px] py-4 px-6 border border-black rounded-full text-black font-gt-walsheim'
          onClick={() => setSliceIndex(sliceIndex + 3)}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

const TweetCard = ({ tweet, name, username, profileImage, url }: Tweet) => {
  return (
    <Link href={url} aria-label='open tweet on twitter' target='_blank' rel='noopener noreferrer'>
      <article className='flex flex-col gap-2 p-4 rounded-[14.76px] border-[1.23px] border-gray-custom-250 bg-white w-full'>
        <Image
          src={profileImage}
          alt={`${name} profile image`}
          className='h-fit bg-gray-custom-250 rounded-full'
          width={44.29}
          height={44.29}
          unoptimized
        />
        <section className='flex flex-col gap-[7.38px]'>
          <h6 className='text-[14.76px] text-black font-inter font-semibold leading-[17.87px]'>{name}</h6>
          <p className='text-[14.76px] text-blue-custom-100 font-inter font-semibold leading-[17.87px]'>@{username}</p>

          <MarkdownWrapper summary={tweet} className='text-sm font-normal font-ibm-plex-serif leading-[18.2px] text-black' />
        </section>
      </article>
    </Link>
  );
};

export default TweetsDisplay;
