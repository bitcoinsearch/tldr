import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SummaryList } from "./post";
import { addSpaceAfterPeriods, formattedDate } from "@/helpers/utils";
import { NewsLetter, NewsLetterDataType } from "@/helpers/types";
import MailchimpSubscribeForm from "@/app/components/client/subscribe-to-newsletter";
import ScrollToTopButton from "@/app/components/client/scroll-to-top";
import { MarkdownWrapper } from "./MarkdownWrapper";

export const NewsletterCard = ({ entry }: { entry: NewsLetter }) => {
  const publishedAtDateDisplay = formattedDate(entry.published_at);
  const path = entry.combined_summ_file_path.length ? entry.combined_summ_file_path : entry.file_path;
  const type = entry.dev_name;

  return (
    <div key={`${entry.id}_${entry.title}`} className='flex flex-col gap-2'>
      <p className='text-sm'>{publishedAtDateDisplay}</p>
      <div className='flex items-center gap-2'>
        <Image src={`/icons/${type}_icon.svg`} width={type === "delvingbitcoin" ? 20 : 16} height={type === "delvingbitcoin" ? 20 : 16} alt='' />
        <p className='font-semibold'>{type}</p>
      </div>
      <Link href={path} className='font-inika text-lg md:text-2xl underline cursor-pointer capitalize pb-3'>
        {entry.title}
      </Link>

      {entry.n_threads !== 0 && (
        <p className='font-inter text-sm md:text-base font-bold hover:text-slate-600 hover:underline hover:underline-offset-2'>
          <Link href={`${path}/#discussion-history`}>{entry.n_threads}</Link>
        </p>
      )}
      <SummaryList summary={entry.summary} />
    </div>
  );
};

export const NewsletterPage = ({ newsletter }: { newsletter: NewsLetterDataType }) => {
  if (!newsletter) return null;
  const sortedActiveThreadData = newsletter.active_posts_this_week.sort((a, b) => {
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });
  const sortedNewThreadData = newsletter.new_threads_this_week.sort((a, b) => {
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });
  newsletter.active_posts_this_week = sortedActiveThreadData;
  newsletter.new_threads_this_week = sortedNewThreadData;

  const formatTextToParagraphs = (text: string) => {
    const spacedText = addSpaceAfterPeriods(text);

    return spacedText.split(/\n\n+/).map((paragraph, index) => (
      <p key={index} className='font-inika text-sm md:text-lg text-gray-800 my-4'>
        {paragraph}
      </p>
    ));
  };

  return (
    <div>
      <section>
        <MailchimpSubscribeForm />
        <h2 className='text-xl md:text-4xl font-normal pb-8 pt-10'>Summary</h2>
        <MarkdownWrapper summary={newsletter.summary_of_threads_started_this_week} className={`font-inika text-sm md:text-lg text-gray-800 my-4`} />
      </section>

      <section className='pb-12'>
        <h2 className='text-xl md:text-4xl font-normal pb-8 pt-10'>New posts</h2>
        <section className='flex flex-col gap-9'>
          {!newsletter.new_threads_this_week.length ? (
            <p>Oops! No new posts this week. Explore the ongoing discussions below.</p>
          ) : (
            newsletter.new_threads_this_week.map((entry) => {
              return <NewsletterCard entry={entry} key={entry.id} />;
            })
          )}
        </section>
      </section>

      <section className='pb-12'>
        <h2 className='text-xl md:text-4xl font-normal pb-8 pt-10'>Ongoing Discussions</h2>
        <section className='flex flex-col gap-9'>
          {newsletter.active_posts_this_week.map((entry) => (
            <NewsletterCard entry={entry} key={entry.id} />
          ))}
        </section>
      </section>
      <ScrollToTopButton />
    </div>
  );
};
