import React from "react";
import Link from "next/link";
import Image from "next/image";
import NewsletterCard from "../../newsletter-card";
import Wrapper from "@/app/components/server/wrapper";
import { getAllNewsletters } from "@/helpers/fs-functions";

const NewsletterSection = () => {
  const allNewsletters = getAllNewsletters();
  if (!allNewsletters) return null;

  const latestNewsletters = allNewsletters?.slice(allNewsletters.length - 3).reverse();

  return (
    <div className='py-20 relative overflow-hidden'>
      <div className='absolute top-0 right-0 left-0 w-full -z-10'>
        <Image src='/icons/newsletter-background-icon.svg' alt='curvy lines' className='w-full' width={1000} height={1000} />
      </div>
      <Wrapper className='flex flex-col gap-12'>
        <section className='flex items-center justify-between'>
          <h5 className='text-start text-[64px] font-normal font-test-signifier leading-[82.75px]'>Latest Bitcoin TLDR Newsletters</h5>
          <Link href='/newsletter' className='flex items-center gap-2 border-b border-black w-fit'>
            <span className='text-lg leading-[25.38px] font-gt-walsheim'>View All Newsletters</span>
          </Link>
        </section>

        <section className='flex gap-6 flex-wrap justify-between'>
          {latestNewsletters === null ? (
            <div className='flex items-center justify-center w-full h-full'>
              <p className='text-lg leading-[25.38px] font-gt-walsheim'>No newsletters found</p>
            </div>
          ) : (
            latestNewsletters.map((newsletter, index) => <NewsletterCard key={newsletter.issueNumber} index={index} {...newsletter} />)
          )}
        </section>
      </Wrapper>
    </div>
  );
};

export default NewsletterSection;
