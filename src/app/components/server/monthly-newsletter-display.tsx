import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsLetter, NewsLetterDataType } from "@/helpers/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { getAllNewsletters } from "@/helpers/fs-functions";
import { colorThemes, newsLetterIconMap } from "@/data";
import NewsletterPopup from "../client/newsletter-popup";
import { MarkdownWrapper } from "./MarkdownWrapper";
import { PostsCard } from "../client/post-card";

export const MonthlyNewsletterDisplay = ({
  newsletter,
  url,
  activeDiscussions,
}: {
  newsletter: NewsLetterDataType;
  url: string;
  activeDiscussions: (NewsLetter & { firstPostDate: string; lastPostDate: string })[];
}) => {
  const allNewsletters = getAllNewsletters();
  const currentNewsletter = allNewsletters?.find((newsletter) => newsletter.url === url);

  if (!newsletter) return null;

  const selectionIndex = currentNewsletter?.issueNumber! % 10;
  const colorTheme = colorThemes[selectionIndex];

  return (
    <div>
      <div className='pt-5 md:pt-[54px]'>
        <Link href='/newsletter' className='flex items-center gap-2 py-2 px-4 md:px-6 rounded-full border border-black w-fit cursor-pointer'>
          <ArrowLeftIcon className='w-5 h-5 md:w-6 md:h-6' strokeWidth={4} />
          <span className='text-sm md:text-base font-medium md:font-normal font-gt-walsheim leading-[18.32px]'>Back to Newsletters</span>
        </Link>
      </div>
      <div>
        <section className='text-base font-gt-walsheim leading-[22.56px] flex items-center gap-4 py-6'>
          {/* breadcrumb */}
          <div className='flex items-center font-medium text-base font-gt-walsheim leading-[20.64px] text-gray-custom-1100 flex-wrap'>
            <Link href='/' className='flex items-center gap-1 justify-center cursor-pointer'>
              <Image src='/icons/home-icon.svg' width={16} height={17} alt='home icon' />
              <p>Home</p>
            </Link>
            <p className='text-gray-custom-1200 px-[5px]'>/</p>
            <Link href='/newsletter' className='cursor-pointer'>
              Newsletters
            </Link>
            <p className='text-gray-custom-1200 px-[5px]'>/</p>
            <Link href={`${url}`} className='text-orange-custom-100 cursor-pointer'>{`TLDR Newsletter for ${currentNewsletter?.dateRange}`}</Link>
          </div>
        </section>

        <div className='flex flex-col'>
          <section className='flex flex-col gap-4 max-w-[866px] mx-auto w-full'>
            {/* header */}
            <div className='h-[120px] md:h-[278px] w-full bg-black rounded-lg flex items-center justify-between'>
              <section className='py-[26px] md:py-[21.5px] pl-12'>
                <p
                  className={`font-test-signifier text-base md:text-[32px] leading-[22.56px] md:leading-[45.12px] text-nowrap text-[${colorTheme}]`}
                  style={{ color: colorTheme }}
                >
                  Bitcoin TLDR
                </p>
                <p
                  className={`font-test-signifier text-[32px] md:text-[88px] font-medium leading-[124.08px] md:leading-[90.24px] text-[${colorTheme}]`}
                  style={{ color: colorTheme }}
                >
                  #{currentNewsletter?.issueNumber}
                </p>
              </section>
              <div className='relative h-[110px] md:h-full w-[110px] md:w-full max-w-[299px]'>
                <Image src={newsLetterIconMap[selectionIndex]} alt='newsletter icon' layout='fill' objectFit='contain' />
              </div>
            </div>
            <p className='text-[36px] font-test-signifier leading-[46.55px]'>Summary </p>
            <p className='text-base font-gt-walsheim leading-[22.56px] text-gray-custom-400'>{currentNewsletter?.dateRange}</p>
            <NewsletterPopup />
            <article className='max-w-[712px] mx-auto pt-2'>
              <MarkdownWrapper
                summary={newsletter.summary_of_threads_started_this_week}
                className={`font-gt-walsheim text-sm md:text-lg leading-[20.61px] text-gray-800 my-4`}
              />
            </article>
            <div className='flex flex-col gap-6 pt-6'>
              <h2 className='text-xl md:text-[40px] leading-[51.72px] font-normal font-test-signifier'>Active Discussions</h2>
              <section className='flex flex-col gap-6'>
                {!activeDiscussions.length ? (
                  <p>Oops! No ongoing discussions this week. Check out the new posts above.</p>
                ) : (
                  activeDiscussions.map((entry) => {
                    return <PostsCard entry={entry} key={entry.id} />;
                  })
                )}
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};