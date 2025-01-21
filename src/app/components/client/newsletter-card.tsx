import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLinkUpRight } from "@bitcoin-dev-project/bdp-ui/icons";
import { colorThemes, newsLetterIconMap } from "@/data";

const NewsletterCard = ({ summary, url, dateRange, issueNumber }: { summary: string; url: string; dateRange: string; issueNumber: number }) => {
  const selectionIndex = issueNumber % 10;
  const colorTheme = colorThemes[selectionIndex];

  return (
    <div className='flex flex-col gap-6 p-4 xl:p-6 border border-gray-custom-600 rounded-lg h-[354px] md:h-[454px] w-full max-w-[421px] bg-white'>
      <div className='h-[120px] md:h-[167px] w-full bg-black rounded-lg flex items-center justify-between'>
        <section className='py-[26px] md:py-[21.5px] pl-6'>
          <p
            className={`font-test-signifier text-base md:text-2xl leading-[22.56px] md:leading-[33.84px] text-nowrap text-[${colorTheme}]`}
            style={{ color: colorTheme }}
          >
            Bitcoin TLDR
          </p>
          <p
            className={`font-test-signifier text-[32px] md:text-[64px] font-medium leading-[45.12px] md:leading-[90.24px] text-[${colorTheme}]`}
            style={{ color: colorTheme }}
          >
            #{issueNumber}
          </p>
        </section>
        <div className='relative h-[110px] md:h-full w-[110px] md:w-full max-w-[167px]'>
          <Image src={newsLetterIconMap[selectionIndex]} alt='newsletter icon' layout='fill' objectFit='contain' />
        </div>
      </div>

      <div className='flex flex-col justify-between flex-1 w-full'>
        <section className='flex flex-col gap-2'>
          <p className='text-base md:text-2xl font-normal leading-[22.56px] md:leading-[33.84px] font-gt-walsheim text-gray-custom-400'>
            {dateRange}
          </p>
          <p className='text-base md:text-lg font-light leading-[22.56px] md:leading-[28.2px] text-black font-test-signifier line-clamp-4'>
            {summary}
          </p>
        </section>
        <Link href={`${url}`} className='flex items-center gap-1 md:gap-2 border-b-[0.5px] border-black w-fit'>
          <span className='text-sm md:text-base font-medium font-gt-walsheim leading-[22.56px]'>Read more</span>
          <ArrowLinkUpRight className='w-4 h-4 md:w-5 md:h-5' />
        </Link>
      </div>
    </div>
  );
};

export default NewsletterCard;
