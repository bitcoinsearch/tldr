import React from "react";
import Link from "next/link";
import { SummaryList } from "./post";
import { formattedDate } from "@/helpers/utils";
import { NewsLetter, NewsLetterDataType } from "@/helpers/types";
import MailchimpSubscribeForm from "@/app/components/client/subscribe-to-newsletter";
import ScrollToTopButton from "@/app/components/client/scroll-to-top";

export const NewsletterCard = ({ entry }: { entry: NewsLetter }) => {
  const publishedAtDateDisplay = formattedDate(entry.published_at);
  const path = entry.combined_summ_file_path.length
    ? entry.combined_summ_file_path
    : entry.file_path;

  return (
    <div key={`${entry.id}_${entry.title}`} className="flex flex-col gap-2">
      <p className="text-sm">{publishedAtDateDisplay}</p>
      <Link
        href={path}
        className="font-inika text-lg md:text-2xl underline cursor-pointer capitalize pb-3"
      >
        {entry.title}
      </Link>
      <SummaryList summary={entry.summary} />
    </div>
  );
};

export const NewsletterPage = ({
  newsletter,
}: {
  newsletter: NewsLetterDataType;
}) => {
  if (!newsletter) return null;
  const sortedActiveThreadData = newsletter.active_posts_this_week.sort(
    (a, b) => {
      return (
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    }
  );
  const sortedNewThreadData = newsletter.new_threads_this_week.sort((a, b) => {
    return (
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  });
  newsletter.active_posts_this_week = sortedActiveThreadData;
  newsletter.new_threads_this_week = sortedNewThreadData;

  return (
    <div>
      <section>
        <MailchimpSubscribeForm />
        <h2 className="text-xl md:text-4xl font-normal pb-8 pt-10">Summary</h2>
        <p className="pb-4">
          {newsletter.summary_of_threads_started_this_week}
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-xl md:text-4xl font-normal pb-8 pt-10">
          New posts
        </h2>
        <section className="flex flex-col gap-9">
          {!newsletter.new_threads_this_week.length ? (
            <p>
              Oops! No new posts this week. Explore the ongoing discussions
              below.
            </p>
          ) : (
            newsletter.new_threads_this_week.map((entry) => {
              return <NewsletterCard entry={entry} key={entry.id} />;
            })
          )}
        </section>
      </section>

      <section className="pb-12">
        <h2 className="text-xl md:text-4xl font-normal pb-8 pt-10">
          Ongoing Discussions
        </h2>
        <section className="flex flex-col gap-9">
          {newsletter.active_posts_this_week.map((entry) => (
            <NewsletterCard entry={entry} key={entry.id} />
          ))}
        </section>
      </section>
      <ScrollToTopButton />
    </div>
  );
};
