import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLinkRight } from "@bitcoin-dev-project/bdp-ui/icons";
import { exploreSectionData } from "@/data";

const ExploreSection = () => {
  return (
    <div className='flex items-start gap-[62px] pt-20 pb-[131px]'>
      <div className='flex flex-col gap-[18px] max-w-[644px]'>
        <h5 className='text-start text-[64px] font-normal font-test-signifier leading-[82.75px]'>Explore Bitcoin Tech Conversations</h5>
        <section className='flex self-start pr-[38px]'>
          <Image src='/icons/dancing-astronaut.svg' alt='dancing astronaut' height={495} width={495} className='' />
        </section>
      </div>

      <div className='max-w-[644px] flex flex-col gap-6 pt-[51px] w-full'>
        {exploreSectionData.map((item) => (
          <ExploreSectionCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
};

export const ExploreSectionCard = ({
  title,
  subtext,
  icon,
  backgroundColor,
  route,
}: {
  title: string;
  subtext: string;
  icon: string;
  backgroundColor: string;
  route: string;
}) => {
  return (
    <div
      className={`flex justify-between max-h-[200px] ${
        subtext.length > 0 ? "h-[200px]" : "h-[172px]"
      } h-ful p-6 rounded-2xl overflow-hidden relative max-w-[644px] w-full`}
      style={{ backgroundColor }}
    >
      <section
        className={`flex flex-col ${
          subtext.length > 0 ? "items-start" : "justify-end"
        } gap-4 w-full max-w-[380px] text-white font-medium font-gt-walsheim`}
      >
        <p className='text-[32px] leading-[45.12px]'>{title}</p>
        {subtext && <p className='text-lg leading-[25.38px]'>{subtext}</p>}

        <Link href={`/posts/${route}`} className='flex items-center gap-2 border-b border-white w-fit'>
          <span className='text-lg leading-[25.38px]'>View All</span>
          <ArrowLinkRight />
        </Link>
      </section>

      <Image src={icon} alt='' height={317} width={317} className='absolute right-0 bottom-0 top-0 w-fit object-contain' />
    </div>
  );
};

export default ExploreSection;
