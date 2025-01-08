import React from "react";
import Image from "next/image";
import { summariesSectionData } from "@/data";
import Wrapper from "@/app/components/server/wrapper";
import { ExploreSectionCard } from "../explore-section/explore-section";

const SummariesSection = () => {
  return (
    <Wrapper>
      <div className='flex flex-col gap-[50px] py-20'>
        <h5 className='text-start text-[64px] font-normal font-test-signifier leading-[82.75px]'>Read Summaries by Source</h5>
        <section className='flex items-end gap-[143px]'>
          <div className='max-w-[644px] flex flex-col gap-6 w-full'>
            {summariesSectionData.map((item) => (
              <ExploreSectionCard key={item.title} {...item} />
            ))}
          </div>
          <div className='flex w-full pb-[9px]'>
            <Image src='/icons/reading-astronaut.svg' alt='reading astronaut' height={495} width={495} className='' />
          </div>
        </section>
      </div>
    </Wrapper>
  );
};

export default SummariesSection;
