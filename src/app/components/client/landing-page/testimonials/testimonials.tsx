import React from "react";
import Image from "next/image";
import TweetsDisplay from "./tweets-display";
import Wrapper from "@/app/components/server/wrapper";
import { getTweetsFromFile } from "@/helpers/fs-functions";

const Testimonials = async () => {
  const tweetsFromFile = await getTweetsFromFile();

  return (
    <div className='py-8 md:py-20 relative bg-orange-custom-200 md:bg-gray-custom-700 z-10 overflow-hidden'>
      <div className='absolute top-0 right-0 left-0 bottom-0 w-full -z-20'>
        <Image src='/icons/testimonial-background-icon.svg' alt='curvy lines' className='w-full h-fit' width={1000} height={1000} />
      </div>

      <Wrapper className='flex flex-col gap-8 md:gap-12'>
        <h5 className='text-[32px] md:text-[56px] lg:text-[64px] font-normal font-test-signifier leading-[41.38px] md:leading-[82.75px] text-center'>
          What People Have to Say
        </h5>
        <TweetsDisplay tweetsFromFile={tweetsFromFile} />
      </Wrapper>
    </div>
  );
};

export default Testimonials;
