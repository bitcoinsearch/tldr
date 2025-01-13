"use client";

import Image from "next/image";
import { NewsletterData } from "@/helpers/types";
import React, { useEffect, useRef, useState } from "react";
import { MarkdownWrapper } from "@/app/components/server/MarkdownWrapper";
import MailchimpSubscribeForm from "../../subscribe-to-newsletter";
import { useMediaQuery } from "../../hooks/use-media-query";
import Link from "next/link";
import { newsLetterIconMap } from "@/data";

const HeroNewsletterDisplay = ({ latestNewsletter }: { latestNewsletter: NewsletterData }) => {
  const [isArticleScrolled, setIsArticleScrolled] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (window.pageYOffset > window.innerHeight * 0.3) {
      scrollToTop();
    }

    return () => {
      window.removeEventListener("scroll", scrollToTop);
    };
  }, []);

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
    <div
      ref={isMobile ? null : heroSectionRef}
      className='w-full md:h-[calc(100vh-81px)] flex flex-col md:flex-row items-center xl:justify-between gap-10 md:gap-6 xl:gap-[53px] py-7 md:py-0'
    >
      <div className='max-w-full md:max-w-[50%] lg:max-w-[741px] flex flex-col gap-6 md:gap-[35px]'>
        <section className='flex flex-col gap-4'>
          <h1 className='text-[32px] md:text-[48px] lg:text-[60px] xl:text-[72px] leading-[41.38px] md:leading-[64.64px] lg:leading-[78.1px] xl:leading-[93.1px] font-test-signifier font-normal'>
            Stay up to Date on the Latest in <span className='text-orange-custom-100'>Bitcoin Tech</span>
          </h1>
          <ol className='list-disc text-sm md:text-base lg:text-lg leading-6 lg:leading-8 font-gt-walsheim font-normal list-inside flex flex-col gap-1'>
            <li>Weekly summaries of bitcoin-dev, lightning-dev, and delving bitcoin mailing lists</li>
            <li>Keep your finger on the pulse of bitcoin tech development and conversations</li>
            <li>Perfect for bitcoin builders, educators, and contributors to stay on top of a growing field</li>
          </ol>
        </section>
        <MailchimpSubscribeForm />
      </div>

      <div className='max-w-full md:max-w-[49%] lg:max-w-[40%] xl:max-w-[37%] h-[470px] md:h-[650px] xl:h-[673px] max-h-[673px] bg-black rounded-[18px] xl:rounded-[30px] p-3 xl:p-[27px] relative'>
        <div
          ref={isMobile ? null : articleRef}
          className='h-full w-full bg-cream-custom-100 rounded-[10px] p-2 md:p-3 xl:p-3.5 overflow-scroll custom-scrollbar flex flex-col gap-2'
        >
          <div className='h-[110px] md:h-[120px] xl:h-[148px] w-full rounded-[5.61px] bg-black flex items-center justify-between'>
            <section className='my-4 pl-4 flex flex-col text-peach-custom-100'>
              <p
                className={`font-test-signifier text-base md:text-lg xl:text-2xl leading-[22.56px] md:leading-[33.84px] xl:leading-[33.84px] text-peach-custom-100 text-nowrap`}
              >
                Bitcoin TLDR
              </p>
              <p
                className={`font-test-signifier text-[32px] md:text-[42px] xl:text-[56px] font-medium leading-[45.12px] md:leading-[56.88px] xl:leading-[78.96px] text-peach-custom-100`}
              >
                #{latestNewsletter.issueNumber}
              </p>
              <p className='text-xs md:text-sm font-medium leading-[19.74px] font-gt-walsheim'>{latestNewsletter.dateRange}</p>
            </section>
            <Image src={newsLetterIconMap[0]} alt='curly arrow' width={148} height={148} className={`text-peach-custom-100 h-full w-fit`} />
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

          <Link
            href={latestNewsletter.url}
            className='font-test-signifier text-sm lg:text-base leading-6 p-4 w-full rounded-full bg-black text-white text-center'
          >
            Read This Week&apos;s Newsletters
          </Link>
        </div>

        <div className='absolute top-[-24px] left-[-16px] w-full min-w-fit 2xl:min-w-[520px] -z-10 hidden md:block'>
          <Image src='/icons/circular-icon.svg' alt='circular icon' width={565} height={565} />
        </div>
      </div>

      <div className='bg-orange-custom-200 absolute top-0 left-0 w-full h-full -z-50 hero-section-clip-path hidden md:flex'></div>
    </div>
  );
};

export default HeroNewsletterDisplay;
