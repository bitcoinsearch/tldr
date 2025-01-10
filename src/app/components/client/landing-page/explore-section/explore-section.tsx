import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLinkRight } from "@bitcoin-dev-project/bdp-ui/icons";
import { exploreSectionData } from "@/data";

const ExploreSection = () => {
  return (
    <div className='flex flex-col md:flex-row items-center md:items-start gap-6 xl:gap-[62px] py-8 md:pt-20 md:pb-[131px]'>
      <div className='flex flex-col gap-[18px] max-w-[644px] md:max-w-[42%] xl:max-w-[644px]'>
        <h5 className='text-start text-[32px] md:text-[48px] xl:text-[64px] font-normal font-test-signifier leading-[41.38px] md:leading-[60px] xl:leading-[82.75px]'>
          Explore Bitcoin Tech Conversations
        </h5>
        <section className='flex self-start xl:pr-[38px] justify-center w-full'>
          <Image
            src='/icons/dancing-astronaut.svg'
            alt='dancing astronaut'
            height={495}
            width={495}
            className='w-[198px] sm:w-[298px] md:w-[495px]'
          />
        </section>
      </div>

      <div className='max-w-[644px] md:max-w-[58%] xl:max-w-[644px] flex flex-col gap-4 md:gap-6 md:pt-[51px] w-full'>
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
      className={`flex justify-between items-center max-h-[200px] ${
        subtext.length > 0 ? "h-[154px] md:h-[200px]" : "h-[106px] md:h-[172px]"
      } h-ful p-6 rounded-2xl overflow-hidden relative max-w-[644px] w-full`}
      style={{ backgroundColor }}
    >
      <section
        className={`flex flex-col ${
          subtext.length > 0 ? "items-start" : "justify-end"
        } gap-2 md:gap-4 w-full max-w-[380px] text-white font-medium font-gt-walsheim`}
      >
        <p className='text-lg md:text-[24px] xl:text-[32px] leading-[25.38px] md:leading-[45.12px] z-10'>{title}</p>
        {subtext && <p className='text-sm md:text-lg leading-[19.74px] md:leading-[25.38px]'>{subtext}</p>}

        <Link href={`/posts/${route}`} className='flex items-center gap-2 border-b border-white w-fit'>
          <span className='text-sm md:text-lg leading-[19.74px] md:leading-[25.38px]'>View All</span>
          <ArrowLinkRight className='w-[16px] h-[16px] md:w-[24px] md:h-[24px]' />
        </Link>
      </section>

      <Image
        src={icon}
        alt=''
        height={317}
        width={317}
        className='absolute -right-8 2xl:-right-2 object-contain w-[180px] h-[180px] md:w-[250px] md:h-[250px] lg:w-[290px] lg:h-[290px] xl:w-[300px] xl:h-[300px]'
      />
    </div>
  );
};

export default ExploreSection;
