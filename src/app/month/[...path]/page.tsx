import React from "react";
import * as fs from "fs";
import { MonthlyNewsletterDisplay } from "@/app/components/server/monthly-newsletter-display";
import { NewsLetterDataType, sortedAuthorData } from "@/helpers/types";
import Wrapper from "@/app/components/server/wrapper";
import { formattedDate, getSummaryDataInfo } from "@/helpers/utils";

const monthlyNewsletter = async (path: string[]) => {
  const pathString = path.join("/").replace("month/", "/");

  try {
    const data = fs.readFileSync(`${process.cwd()}/public/static/static/${pathString}`, "utf-8");
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

export default async function Page({ params }: { params: { path: string[] } }) {
  const url = params.path.join("/").replace("month/", "/");

  const data = await monthlyNewsletter(params.path);
  if (!data) return <h1>No Data found</h1>;

  const sortedNewThreadData = data.new_threads_this_week.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  // Get active discussions and add first and last post date
  const activeDiscussions = await Promise.all(
    data.active_posts_this_week.map(async (post) => {
      const filePath = post.combined_summ_file_path || post.file_path;
      const pathArray = filePath.split("summary/");
      const pathString = pathArray[1].split("/");

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

  data.new_threads_this_week = sortedNewThreadData;

  return (
    <Wrapper>
      <MonthlyNewsletterDisplay newsletter={data} url={`/month/${url}`} activeDiscussions={activeDiscussions} />
    </Wrapper>
  );
}
