import Link from "next/link";
import Wrapper from "../components/server/wrapper";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { getAllNewsletters } from "@/helpers/fs-functions";
import NewsletterCard from "../components/client/newsletter-card";

export default async function Page() {
  const getNewsletters = getAllNewsletters();
  if (!getNewsletters) return null;

  const allNewsletters = getNewsletters?.reverse();

  return (
    <Wrapper className=''>
      <div className='pt-[54px] pb-8'>
        <Link href='/' className='flex items-center gap-2 py-2 px-6 rounded-full border border-black w-fit'>
          <ArrowLeftIcon className='w-4 h-4 md:w-6 md:h-6' />
          <span className='text-sm md:text-base font-gt-walsheim leading-[18.32px]'>Back Home</span>
        </Link>
      </div>

      <div className='flex flex-col gap-8'>
        <h1 className='text-center text-[32px] md:text-[48px] xl:text-[64px] font-normal font-test-signifier leading-[41.38px] md:leading-[60px] xl:leading-[82.75px]'>
          Latest Bitcoin TLDR Newsletters
        </h1>

        <div className='flex flex-col gap-6'>
          <section className='text-base font-gt-walsheim leading-[22.56px] flex items-center gap-4'>
            <button className='text-white bg-orange-custom-100 px-4 py-1 rounded-full'>Newest First</button>
            <button className='text-black bg-gray-custom-1000 px-4 py-1 rounded-full '>Oldest First</button>
          </section>

          <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xl:gap-6 self-center justify-center'>
            {allNewsletters === null ? (
              <div className='flex items-center justify-center w-full h-full'>
                <p className='text-lg leading-[25.38px] font-gt-walsheim'>No newsletters found</p>
              </div>
            ) : (
              allNewsletters.map((newsletter, index) => <NewsletterCard key={newsletter.issueNumber} index={index} {...newsletter} />)
            )}
          </section>
        </div>
      </div>
    </Wrapper>
  );
}
