import Link from "next/link";
import Image from "next/image";
import { SummaryList } from "../server/post";
import { ContributorsList } from "../server/post";
import { NewsLetter } from "@/helpers/types";

export const PostsCard = ({ entry }: { entry: NewsLetter & { firstPostDate: string; lastPostDate: string } }) => {
  const path = entry.combined_summ_file_path.length ? entry.combined_summ_file_path : entry.file_path;
  const type = entry.dev_name;

  return (
    <div className='flex flex-col gap-2 border border-gray-custom-600 rounded-xl p-6'>
      <section className='flex items-center justify-between'>
        <Link
          href={path}
          className='font-test-signifier text-lg md:text-2xl font-medium cursor-pointer capitalize leading-[33.84px] line-clamp-2 w-full'
        >
          {entry.title}
        </Link>

        {entry.n_threads !== 0 && (
          <Link
            href={`${path}/#discussion-history`}
            className='font-gt-walsheim text-sm md:text-base font-medium  hover:underline hover:underline-offset-2 text-nowrap'
          >
            {entry.n_threads} {entry.n_threads === 1 ? "reply" : "replies"}
          </Link>
        )}
      </section>

      <div className='flex flex-col gap-2 font-gt-walsheim text-sm md:text-base leading-[22.56px] capitalize text-gray-custom-1300'>
        <section className='flex items-center justify-between'>
          <p className=''>By {entry.authors[0]}</p>
          <div className='flex items-center gap-1'>
            <Image src={`/icons/${type}_icon.svg`} width={type === "delvingbitcoin" ? 20 : 16} height={type === "delvingbitcoin" ? 20 : 16} alt='' />
            <p className='text-sm leading-[19.74px] capitalize'>{type}</p>
          </div>
        </section>
        <ContributorsList contributors={entry.contributors} />
        <section className='flex items-center gap-2'>
          <Image src='/icons/calendar-icon.svg' width={20} height={21} alt='calendar icon' />
          <p className='text-base leading-[22.56px]'>
            <span className='normal-case'> Original post on</span> {entry.firstPostDate}
          </p>
        </section>
        <section className='flex items-center gap-2'>
          <Image src='/icons/cyclic-icon.svg' width={20} height={20} alt='cyclic icon' />
          <p className='text-base leading-[22.56px]'>
            <span className='normal-case'>Last reply on</span> {entry.lastPostDate}
          </p>
        </section>
      </div>

      <SummaryList summary={entry.summary} />
    </div>
  );
};
