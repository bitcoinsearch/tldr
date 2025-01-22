import React from "react";
import Link from "next/link";
import Image from "next/image";
import NewsletterCard from "../../newsletter-card";
import Wrapper from "@/app/components/server/wrapper";
import { getAllNewsletters } from "@/helpers/fs-functions";
import { ArrowLinkRight } from "@bitcoin-dev-project/bdp-ui/icons";

const NewsletterSection = () => {
  const allNewsletters = getAllNewsletters();
  if (!allNewsletters) return null;

  const latestNewsletters = allNewsletters?.slice(allNewsletters.length - 3).reverse();

  return (
    <div className='py-8 md:py-20 relative overflow-hidden'>
      <div className='absolute top-0 right-0 left-0 w-full -z-10'>
        <Image src='/icons/newsletter-background-icon.svg' alt='curvy lines' className='w-full' width={1000} height={1000} />
      </div>
      <Wrapper className='flex flex-col gap-6 md:gap-12'>
        <section className='flex items-center justify-between gap-6'>
          <h5 className='text-start text-[32px] md:text-[56px] xl:text-[64px] font-normal font-test-signifier leading-[41.38px] md:leading-[65.52px] lg:leading-[82.75px]'>
            Latest Bitcoin TLDR Newsletters
          </h5>
          <Link href='/newsletter' className='hidden md:flex items-center gap-2 border-b border-black w-fit'>
            <span className='text-lg leading-[25.38px] font-gt-walsheim text-nowrap'>View All Newsletters</span>
          </Link>
        </section>

        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xl:gap-6 self-center justify-center'>
          {latestNewsletters === null ? (
            <div className='flex items-center justify-center w-full h-full'>
              <p className='text-lg leading-[25.38px] font-gt-walsheim'>No newsletters found</p>
            </div>
          ) : (
            latestNewsletters.map((newsletter) => <NewsletterCard key={newsletter.issueNumber} {...newsletter} />)
          )}
        </section>

        <div className='flex justify-center pt-6'>
          <Link
            href='/newsletter'
            className='flex md:hidden text-sm font-medium leading-[19.74px] py-4 px-6 border border-black rounded-full text-black font-gt-walsheim items-center gap-2'
          >
            <span className='text-sm font-medium leading-[19.74px]'>View all Newsletters</span>
            <ArrowLinkRight className='w-[16px] h-[16px] md:w-[24px] md:h-[24px]' />
          </Link>
        </div>
      </Wrapper>
    </div>
  );
};

export default NewsletterSection;
