import React from "react";
import Image from "next/image";
import { summariesSectionData } from "@/data";
import Wrapper from "@/app/components/server/wrapper";
import { ExploreSectionCard } from "../explore-section/explore-section";

const SummariesSection = () => {
  return (
    <Wrapper>
      <div className='flex flex-col gap-6 md:gap-[50px] py-8 md:py-20'>
        <h5 className='text-start text-[32px] md:text-[56px] lg:text-[64px] font-normal font-test-signifier leading-[41.38px] md:leading-[82.75px]'>
          Read Summaries by Source
        </h5>
        <section className='flex items-center justify-center flex-col-reverse md:flex-row gap-4 lg:gap-12 xl:gap-[143px] w-full'>
          <div className='flex flex-col gap-2 md:gap-6 w-full max-w-[644px] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[644px]'>
            {summariesSectionData.map((item) => (
              <ExploreSectionCard key={item.title} {...item} />
            ))}
          </div>
          <div className='flex w-full pb-[9px] justify-center md:justify-end max-w-full md:max-w-[40%] xl:max-w-[40%]'>
            <Image
              src='/icons/reading-astronaut.svg'
              alt='reading astronaut'
              height={495}
              width={495}
              className='w-[198px] sm:w-[298px] md:w-[495px]'
            />
          </div>
        </section>
      </div>
    </Wrapper>
  );
};

export default SummariesSection;
