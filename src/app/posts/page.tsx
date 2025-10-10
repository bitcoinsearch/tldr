import React from "react";
import * as fs from "fs";
import { fetchAllActivityPosts, fetchAndProcessPosts } from "@/helpers/fs-functions";
import { HomepageData, HomepageEntryData, MailingListType, sortedAuthorData, SortKey } from "@/helpers/types";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { formattedDate } from "@/helpers/utils";
import { getSummaryDataInfo } from "@/helpers/utils";
import Wrapper from "../components/server/wrapper";
import { ActiveDiscussions } from "./active-discussions";
import HistoricConversations from "./historic-converstions";
import AllActivity from "./all-activity";

const getSelectionList = (data: HomepageData, mailingListSelection: MailingListType | null) => {
  const filterByMailingList = (posts: HomepageEntryData[]) =>
    mailingListSelection ? posts.filter((entry) => entry.dev_name === mailingListSelection) : posts;

  return {
    recent_posts: filterByMailingList([...data.recent_posts]),
    active_posts: filterByMailingList([...data.active_posts]),
    today_in_history_posts: filterByMailingList([...data.today_in_history_posts]),
  };
};

const getSummaryData = async (path: string[]) => {
  const pathString = path.join("/");
  try {
    const fileContent = fs.readFileSync(`${process.cwd()}/public/static/static/${pathString}`, "utf-8");
    const summaryInfo = getSummaryDataInfo(path, fileContent);
    return summaryInfo;
  } catch (err) {
    return null;
  }
};

const page = async ({ params, searchParams }: { params: { path: string[] }; searchParams: { [key: string]: string | undefined } }) => {

  // NOTE: account for scenarios when source is not provided
  const source = searchParams.source || "active-discussions";
  const dev: SortKey = (searchParams.dev || "all") as SortKey;

  const posts = await fetchAndProcessPosts();
  const { batch: allActivity, count } = await fetchAllActivityPosts(0);

  const dataSelectionMap: Record<string, { title: string; subtitle: string; posts: HomepageEntryData[] }> = {
    "active-discussions": {
      title: "Active Discussions",
      subtitle: "Check out posts actively getting replies and inspiring conversations.",
      posts: posts.active_posts,
    },
    "historic-conversations": {
      title: "Historic Conversations",
      subtitle: "Explore posts from past years in this historic deep dive.",
      posts: allActivity,
    },
    "all-activity": {
      title: "All Activity",
      subtitle: "Read the most recent individual posts in chronological order.",
      posts: allActivity,
    },
  };

  const pageData = dataSelectionMap[source] ? dataSelectionMap[source] : dataSelectionMap["all-activity"];

  const createPostData = async (data: HomepageEntryData[]) => {
    const allPosts = await Promise.all(
      data.map(async (post) => {
        let filePath = (post.combined_summ_file_path || post.file_path);
        filePath = filePath.includes(".xml") ? filePath : filePath + ".xml"
        const pathArray = filePath.split("/");
        const pathString = pathArray.slice(pathArray.length - 3);
       
        const summaryData = await getSummaryData(pathString);
        const authors = summaryData?.data.authors || [];
        const [firstPostAuthor, lastPostAuthor] = [authors[0], authors[authors.length - 1]];

        const createDate = (author: sortedAuthorData) => {
          try {
            const dateObj = new Date(author.dateInMS);
            if (isNaN(dateObj.getTime())) {
              return 'Invalid Date';
            }
            const dateString = dateObj.toISOString();
            const publishedAtDateDisplay = formattedDate(dateString);
            return publishedAtDateDisplay;
          } catch (error) {
            return 'Invalid Date';
          }
        };

        const firstPostDate = createDate(firstPostAuthor);
        const lastPostDate = createDate(lastPostAuthor);

        const cleanedUpPost  = post.title.replace("Combined summary - ", "")
        return {
          ...post,
          title: cleanedUpPost,
          firstPostDate,
          lastPostDate,
        };
      })
    );

    return allPosts;
  };

  const postsToDisplay = await createPostData(pageData.posts);

  const contentSection: { [key: string]: React.JSX.Element } = {
    "active-discussions": <ActiveDiscussions dev={dev} posts={postsToDisplay} />,
    "historic-conversations": <HistoricConversations dev={dev} posts={postsToDisplay} />,
    "all-activity": <AllActivity dev={dev} posts={postsToDisplay} />,
  };

  const contentToRender = contentSection[source] ?  contentSection[source] : contentSection["all-activity"]
  return (
    <Wrapper>
      <div className='min-h-[calc(100vh-113px)] flex flex-col gap-8'>
        <DynamicHeader title={pageData.title} subtitle={pageData.subtitle} />
        <div>{contentToRender}</div>
      </div>
    </Wrapper>
  );
};

export default page;

const DynamicHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div>
      <div className='pt-5 md:pt-[54px] pb-8'>
        <Link href='/' className='flex items-center gap-2 py-2 px-4 md:px-6 rounded-full border border-black w-fit'>
          <ArrowLeftIcon className='w-5 h-5 md:w-6 md:h-6' strokeWidth={4} />
          <span className='text-sm md:text-base font-medium md:font-normal font-gt-walsheim leading-[18.32px]'>Back Home</span>
        </Link>
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='text-center text-[32px] md:text-[48px] xl:text-[64px] font-normal font-test-signifier leading-[41.38px] md:leading-[60px] xl:leading-[82.75px]'>
          {title}
        </h1>
        <p className='text-base font-gt-walsheim leading-[22.56px] text-center'>{subtitle}</p>
      </div>
    </div>
  );
};
