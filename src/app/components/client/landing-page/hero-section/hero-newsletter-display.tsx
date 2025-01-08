"use client";

import Image from "next/image";
import { NewsletterData } from "@/helpers/types";
import React, { useEffect, useRef, useState } from "react";
import NewsletterStars from "@/public/icons/newsletter-stars";
import { MarkdownWrapper } from "@/app/components/server/MarkdownWrapper";
import MailchimpSubscribeForm from "../../subscribe-to-newsletter";

const HeroNewsletterDisplay = ({ latestNewsletter }: { latestNewsletter: NewsletterData }) => {
  const [isArticleScrolled, setIsArticleScrolled] = useState(false);
  const articleRef = React.useRef<HTMLDivElement>(null);
  const heroSectionRef = React.useRef<HTMLDivElement>(null);
  const touchStartY = React.useRef<number>(0);

  // React.useEffect(() => {
  //   const handleWheel = (e: WheelEvent) => {
  //     if (!articleRef.current || !heroSectionRef.current) return;

  //     // Check if we're within the hero section bounds
  //     const heroRect = heroSectionRef.current.getBoundingClientRect();
  //     const isInHeroSection = heroRect.top <= 0 && heroRect.bottom >= 0;

  //     if (!isInHeroSection) return;

  //     const article = articleRef.current;
  //     const isAtBottom = Math.abs(article.scrollHeight - article.scrollTop - article.clientHeight) < 1;

  //     if (!isArticleScrolled && !isAtBottom) {
  //       e.preventDefault();
  //       article.scrollTop += e.deltaY;
  //     } else if (isAtBottom) {
  //       setIsArticleScrolled(true);
  //     }
  //   };

  //   const handleTouchStart = (e: TouchEvent) => {
  //     touchStartY.current = e.touches[0].clientY;
  //   };

  //   const handleTouchMove = (e: TouchEvent) => {
  //     if (!articleRef.current || !heroSectionRef.current) return;

  //     // Check if we're within the hero section bounds
  //     const heroRect = heroSectionRef.current.getBoundingClientRect();
  //     const isInHeroSection = heroRect.top <= 0 && heroRect.bottom >= 0;

  //     if (!isInHeroSection) return;

  //     const article = articleRef.current;
  //     const touchDelta = touchStartY.current - e.touches[0].clientY;
  //     const isAtBottom = Math.abs(article.scrollHeight - article.scrollTop - article.clientHeight) < 1;

  //     if (!isArticleScrolled && !isAtBottom) {
  //       e.preventDefault();
  //       article.scrollTop += touchDelta;
  //       touchStartY.current = e.touches[0].clientY;
  //     } else if (isAtBottom) {
  //       setIsArticleScrolled(true);
  //     }
  //   };

  //   // Add event listeners
  //   window.addEventListener("wheel", handleWheel, { passive: false });
  //   window.addEventListener("touchstart", handleTouchStart, { passive: true });
  //   window.addEventListener("touchmove", handleTouchMove, { passive: false });

  //   return () => {
  //     window.removeEventListener("wheel", handleWheel);
  //     window.removeEventListener("touchstart", handleTouchStart);
  //     window.removeEventListener("touchmove", handleTouchMove);
  //   };
  // }, [isArticleScrolled]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (!articleRef.current || !heroSectionRef.current) return;

      const article = articleRef.current;
      const isAtBottom = article.scrollHeight - Math.round(article.scrollTop) === article.clientHeight;

      if (!isArticleScrolled) {
        e.preventDefault();

        article.scrollTop += e.deltaY;

        if (isAtBottom) {
          setIsArticleScrolled(true);
        }
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [isArticleScrolled]);

  return (
    <div ref={heroSectionRef} className='w-full h-[calc(100vh-113px)] flex items-center justify-between gap-[53px]'>
      <div className='max-w-[741px] flex flex-col gap-[35px]'>
        <section className='flex flex-col gap-4'>
          <h1 className='text-[72px] leading-[93.1px] font-test-signifier font-normal'>
            Stay up to Date on the Latest in <span className='text-orange-custom-100'>Bitcoin Tech</span>
          </h1>
          <ol className='list-disc text-lg leading-[32px] font-gt-walsheim font-normal list-inside'>
            <li>Weekly summaries of bitcoin-dev, lightning-dev, and delving bitcoin mailing lists</li>
            <li>Keep your finger on the pulse of bitcoin tech development and conversations</li>
            <li>Perfect for bitcoin builders, educators, and contributors to stay on top of a growing field</li>
          </ol>
        </section>
        <MailchimpSubscribeForm />
      </div>

      {/* <HeroNewsletterDisplay latestNewsletter={latestNewsletter} /> */}

      <div className='min-w-[491px] max-w-[491px] h-[673px] bg-black rounded-[30px] p-[27px] relative'>
        <div ref={articleRef} className='h-full w-full bg-cream-custom-100 rounded-[10px] p-3.5 overflow-scroll custom-scrollbar flex flex-col gap-2'>
          <div className='h-[148px] w-full rounded-[5.61px] bg-black flex items-center justify-between'>
            <section className='my-4 pl-4 flex flex-col text-peach-custom-100'>
              <p className={`font-test-signifier text-2xl leading-[33.84px] text-peach-custom-100`}>Bitcoin TLDR</p>
              <p className={`font-test-signifier text-[56px] font-medium leading-[78.96px] text-peach-custom-100`}>#{latestNewsletter.issueNumber}</p>
              <p className='text-sm font-medium leading-[19.74px] font-gt-walsheim'>{latestNewsletter.dateRange}</p>
            </section>
            <NewsletterStars className={`text-peach-custom-100 h-[168px] w-[168px]`} fill={"#F39595"} />
          </div>

          <div className='flex flex-col gap-[11.23px] font-gt-walsheim'>
            <p className='text-[19.65px] leading-[27.7px] font-medium'>Catch up on This Week&apos;s Activity</p>
            <article className='text-[12.63px] leading-[17.81px] tracking-[1%] overflow-scroll custom-scrollbar'>
              <MarkdownWrapper
                summary={latestNewsletter.summary}
                className={`font-gt-walsheim text-[12.63px] leading-[17.81px] tracking-wide pb-0`}
              />
            </article>
          </div>
        </div>

        <div className='absolute top-[-24px] left-[-16px] min-w-[520px] w-full -z-10'>
          <Image src='/icons/circular-icon.svg' alt='circular icon' width={520} height={520} className='' />
        </div>
      </div>

      <div className='bg-orange-custom-200 absolute top-0 left-0 w-full h-full -z-50 hero-section-clip-path'></div>
    </div>

    // <div className='min-w-[491px] max-w-[491px] h-[673px] bg-black rounded-[30px] p-[27px] relative'>
    //   <div ref={articleRef} className='h-full w-full bg-cream-custom-100 rounded-[10px] p-3.5 overflow-scroll custom-scrollbar flex flex-col gap-2'>
    //     <div className='h-[148px] w-full rounded-[5.61px] bg-black flex items-center justify-between'>
    //       <section className='my-4 pl-4 flex flex-col text-peach-custom-100'>
    //         <p className={`font-test-signifier text-2xl leading-[33.84px] text-peach-custom-100`}>Bitcoin TLDR</p>
    //         <p className={`font-test-signifier text-[56px] font-medium leading-[78.96px] text-peach-custom-100`}>#{latestNewsletter.issueNumber}</p>
    //         <p className='text-sm font-medium leading-[19.74px] font-gt-walsheim'>{latestNewsletter.dateRange}</p>
    //       </section>
    //       <NewsletterStars className={`text-peach-custom-100 h-[168px] w-[168px]`} fill={"#F39595"} />
    //     </div>

    //     <div className='flex flex-col gap-[11.23px] font-gt-walsheim'>
    //       <p className='text-[19.65px] leading-[27.7px] font-medium'>Catch up on This Week&apos;s Activity</p>
    //       <article className='text-[12.63px] leading-[17.81px] tracking-[1%] overflow-scroll custom-scrollbar'>
    //         <MarkdownWrapper summary={latestNewsletter.summary} className={`font-gt-walsheim text-[12.63px] leading-[17.81px] tracking-wide pb-0`} />
    //       </article>
    //     </div>
    //   </div>

    //   <div className='absolute top-[-24px] left-[-16px] min-w-[520px] w-full -z-10'>
    //     <Image src='/icons/circular-icon.svg' alt='circular icon' width={520} height={520} className='' />
    //   </div>
    // </div>
  );
};

export default HeroNewsletterDisplay;
