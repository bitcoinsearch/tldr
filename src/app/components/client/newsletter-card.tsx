import React from "react";
import Link from "next/link";
import { ArrowLinkUpRight } from "@bitcoin-dev-project/bdp-ui/icons";
import NewsletterStars from "@/public/icons/newsletter-stars";

const NewsletterCard = ({
  summary,
  url,
  dateRange,
  issueNumber,
  index,
}: {
  summary: string;
  url: string;
  dateRange: string;
  issueNumber: number;
  index: number;
}) => {
  const theme = ["#F39595", "#FAE1DD", "#F1F8B5"];
  const colorTheme = theme[index];

  return (
    <div className='flex flex-col gap-6 p-6 border border-gray-custom-600 rounded-lg h-[454px] w-full max-w-[421px] bg-white'>
      <div className='h-[167px] w-full bg-black rounded-lg flex items-center justify-between'>
        <section className='py-[21.5px] pl-6'>
          <p className={`font-test-signifier text-2xl leading-[33.84px] text-[${colorTheme}]`} style={{ color: colorTheme }}>
            Bitcoin TLDR
          </p>
          <p className={`font-test-signifier text-[64px] font-medium leading-[90.24px] text-[${colorTheme}]`} style={{ color: colorTheme }}>
            #{issueNumber}
          </p>
        </section>
        <NewsletterStars className={`text-[${colorTheme}] h-[138px] w-[138px]`} fill={colorTheme} />
      </div>

      <div className='flex flex-col justify-between flex-1 w-full'>
        <section className='flex flex-col gap-2'>
          <p className='text-2xl font-normal leading-[33.84px] font-gt-walsheim text-gray-custom-400'>{dateRange}</p>
          <p className='text-lg font-normal leading-[28.2px] text-black font-test-signifier line-clamp-4'>{summary} </p>
        </section>
        <Link href={`${url}`} className='flex items-center gap-2 border-b-[0.5px] border-black w-fit'>
          <span className='text-base font-medium leading-[22.56px]'>Read more</span>
          <ArrowLinkUpRight className='w-5 h-5' />
        </Link>
      </div>
    </div>
  );
};

export default NewsletterCard;
