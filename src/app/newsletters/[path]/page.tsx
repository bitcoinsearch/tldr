import React from "react";
import * as fs from "fs";
import { MonthlyNewsletterDisplay } from "@/app/components/server/monthly-newsletter-display";
import { NewsLetter, NewsLetterDataType, sortedAuthorData } from "@/helpers/types";
import Wrapper from "@/app/components/server/wrapper";
import { formattedDate, getSummaryDataInfo } from "@/helpers/utils";
import { notFound } from "next/navigation";

const monthlyNewsletter = async (path: string) => {
  try {
    const data = fs.readFileSync(`${process.cwd()}/public/static/static/${path}`, "utf-8");
    const parsedData = JSON.parse(data) as NewsLetterDataType;
    return parsedData;
  } catch (err) {
    return null;
  }
};

const getSummaryData = async (path: string[]) => {
  const pathString = path.join("/");
  try {
    const fileContent = fs.readFileSync(`${process.cwd()}/public/static/static/${pathString}.xml`, "utf-8");
    const summaryInfo = getSummaryDataInfo(path, fileContent);
    return summaryInfo;
  } catch (err) {
    return null;
  }
};

export default async function Page({ params }: { params: { path: string } }) {
  const url = params.path;
  const splitUrl = url.split("-");
  const monthsInOrder: Record<string, string> = {
    "01": "Jan",
    "02": "Feb",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "Aug",
    "09": "Sept",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };

  const [year, month, _day] = splitUrl;
  const newsletterPath = `/newsletters/${`${monthsInOrder[month]}_${year}`}/${url}-newsletter.json`;

  const data = await monthlyNewsletter(newsletterPath);
  if (!data) return notFound();

  const sortedNewThreadData = data.new_threads_this_week.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  // Get posts and add first and last post date
  const addDateToPosts = async (posts: NewsLetter[]) => {
    const datedPosts = await Promise.all(
      posts.map(async (post) => {
        const filePath = post.combined_summ_file_path || post.file_path;
        const pathArray = filePath.split("/");
        const pathString = pathArray.slice(pathArray.length - 3);

        const summaryData = await getSummaryData(pathString);
        const { authors } = summaryData?.data!;
        const [firstPostAuthor, lastPostAuthor] = [authors[0], authors[authors.length - 1]];

        const createDate = (author: sortedAuthorData) => {
          const dateObj = new Date(author.dateInMS);
          const dateString = dateObj.toISOString();
          const publishedAtDateDisplay = formattedDate(dateString);

          return publishedAtDateDisplay;
        };

        const firstPostDate = createDate(firstPostAuthor);
        const lastPostDate = createDate(lastPostAuthor);

        return {
          ...post,
          firstPostDate,
          lastPostDate,
        };
      })
    );

    return { datedPosts };
  };

  const { datedPosts } = await addDateToPosts(data.active_posts_this_week);
  data.new_threads_this_week = sortedNewThreadData;

  return (
    <Wrapper>
      <MonthlyNewsletterDisplay newsletter={data} url={`/newsletters/${url}`} activeDiscussions={datedPosts} />
    </Wrapper>
  );
}
