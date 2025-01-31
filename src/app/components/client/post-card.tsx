import Link from "next/link";
import Image from "next/image";
import { SummaryList } from "../server/post";
import { ContributorsList } from "../server/post";
import { NewsLetter } from "@/helpers/types";

export const PostsCard = ({ entry }: { entry: NewsLetter & { firstPostDate: string; lastPostDate: string } }) => {
  const path = entry.combined_summ_file_path.length ? entry.combined_summ_file_path : entry.file_path;
  const type = entry.dev_name;

  const breakWords = (text: string) => {
    const words = text.split(" ");

    const breakWords = words.map((word, index) => {
      if (word.length >= 20) {
        const firstPart = word.slice(0, 10);
        const secondPart = word.slice(10);

        return (
          <span key={index} className='break-words'>
            {firstPart} - {secondPart}
          </span>
        );
      }

      return `${word} `;
    });

    return breakWords;
  };

  return (
    <article className='flex flex-col gap-2 border border-gray-custom-600 rounded-xl p-4 md:p-6'>
      <section className='flex flex-col md:flex-row gap-2 items-start md:items-center justify-between flex-wrap'>
        <Link href={path}>
          <p className='font-test-signifier text-lg md:text-2xl font-medium cursor-pointer capitalize leading-[25.38px] md:leading-[33.84px] break-words whitespace-pre-wrap hidden sm:block'>
            {entry.title}
          </p>
          <p className='font-test-signifier text-lg md:text-2xl font-medium cursor-pointer capitalize leading-[25.38px] md:leading-[33.84px] break-words whitespace-pre-wrap block sm:hidden'>
            {breakWords(entry.title)}
          </p>
        </Link>

        {entry.n_threads !== 0 && (
          <Link
            href={`${path}/#discussion-history`}
            className='font-gt-walsheim text-sm md:text-base font-medium  hover:underline hover:underline-offset-2 text-nowra break-words'
          >
            {entry.n_threads} {entry.n_threads === 1 ? "reply" : "replies"}
          </Link>
        )}
      </section>

      <div className='flex flex-col gap-2 font-gt-walsheim text-sm md:text-base leading-[22.56px] capitalize text-gray-custom-1300'>
        <section className='flex items-center justify-between'>
          <p className=''>By {entry.authors[0]}</p>
          <div className='hidden sm:flex items-center gap-1 bg-gray-custom-1000 rounded-full px-2 py-[2px] w-fit'>
            <Image src={`/icons/${type}_icon.svg`} width={type === "delvingbitcoin" ? 20 : 16} height={type === "delvingbitcoin" ? 20 : 16} alt='' />
            <p className='text-sm leading-[19.74px] capitalize'>{type}</p>
          </div>
        </section>
        <ContributorsList contributors={entry.contributors} />
        <section className='flex items-center gap-2'>
          <Image src='/icons/calendar-icon.svg' width={20} height={20} alt='calendar icon' className='w-4 h-4 md:w-5 md:h-5' />
          <p className='text-sm md:text-base leading-[19.74px] md:leading-[22.56px]'>
            <span className='normal-case'> Original post on</span> {entry.firstPostDate}
          </p>
        </section>
        <section className='flex items-center gap-2'>
          <Image src='/icons/cyclic-icon.svg' width={20} height={20} alt='cyclic icon' className='w-4 h-4 md:w-5 md:h-5' />
          <p className='text-sm md:text-base leading-[19.74px] md:leading-[22.56px]'>
            <span className='normal-case'>Last reply on</span> {entry.lastPostDate}
          </p>
        </section>

        <div className='flex sm:hidden items-center gap-1 bg-gray-custom-1000 rounded-full px-2 py-[2px] w-fit'>
          <Image src={`/icons/${type}_icon.svg`} width={type === "delvingbitcoin" ? 20 : 16} height={type === "delvingbitcoin" ? 20 : 16} alt='' />
          <p className='text-sm leading-[19.74px] capitalize'>{type}</p>
        </div>
      </div>

      <SummaryList summary={entry.summary} />
    </article>
  );
};
