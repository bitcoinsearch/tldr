import React from "react";
import Image from "next/image";
import { featuresSectionData } from "@/data";

const FeaturesSection = () => {
  return (
    <div className='w-full flex items-center justify-center'>
      <div className='flex flex-col md:flex-row gap-6 items-center justify-between max-w-[1130px] py-[32px] md:py-[90px] w-full flex-'>
        {featuresSectionData.map((item) => (
          <FeatureCard {...item} key={item.icon} />
        ))}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, subtext }: { icon: string; title: string; subtext: string }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-6 max-w-[300px]'>
      <Image src={icon} alt={`${icon}`} width={32} height={32} className='max-h-8' />
      <section>
        <h5 className='uppercase text-base md:text-xl leading-[18.32px] md:leading-[27.48px] font-medium font-gt-walsheim pb-4 text-center text-nowrap'>
          {title}
        </h5>
        <p className='text-sm md:text-base leading-[18.32px] md:leading-[27.48px] font-gt-walsheim text-center'>{subtext}</p>
      </section>
    </div>
  );
};

export default FeaturesSection;
