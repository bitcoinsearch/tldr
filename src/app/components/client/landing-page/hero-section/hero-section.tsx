import React from "react";
import { getAllNewsletters } from "@/helpers/fs-functions";
import MailchimpSubscribeForm from "../../subscribe-to-newsletter";
import HeroNewsletterDisplay from "./hero-newsletter-display";

const HeroSection = () => {
  const allNewsletters = getAllNewsletters();
  const latestNewsletter = allNewsletters[allNewsletters.length - 1];

  return (
    // <div className='w-full h-[calc(100vh-113px)] flex items-center justify-between gap-[53px]'>
    //   <div className='max-w-[741px] flex flex-col gap-[35px]'>
    //     <section className='flex flex-col gap-4'>
    //       <h1 className='text-[72px] leading-[93.1px] font-test-signifier font-normal'>
    //         Stay up to Date on the Latest in <span className='text-orange-custom-100'>Bitcoin Tech</span>
    //       </h1>
    //       <ol className='list-disc text-lg leading-[32px] font-gt-walsheim font-normal list-inside'>
    //         <li>Weekly summaries of bitcoin-dev, lightning-dev, and delving bitcoin mailing lists</li>
    //         <li>Keep your finger on the pulse of bitcoin tech development and conversations</li>
    //         <li>Perfect for bitcoin builders, educators, and contributors to stay on top of a growing field</li>
    //       </ol>
    //     </section>
    //     <MailchimpSubscribeForm />
    //   </div>

    //   <HeroNewsletterDisplay latestNewsletter={latestNewsletter} />
    //   <div className='bg-orange-custom-200 absolute top-0 left-0 w-full h-full -z-50 hero-section-clip-path'></div>
    // </div>

    <HeroNewsletterDisplay latestNewsletter={latestNewsletter} />
  );
};

export default HeroSection;
