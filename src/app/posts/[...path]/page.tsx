import React from "react";
import * as fs from "fs";
import Homepage from "@/app/components/client/homepage";
import { fetchAllActivityPosts, fetchAndProcessPosts } from "@/helpers/fs-functions";
import { HomepageData, HomepageEntryData, MailingListType, sortedAuthorData } from "@/helpers/types";
import Wrapper from "../../components/server/wrapper";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { DynamicHeader } from "./acitve-discussions";
import { PostsCard } from "@/app/components/client/post-card";
import { formattedDate } from "@/helpers/utils";
import { getSummaryDataInfo } from "@/helpers/utils";

/**Please do not delete this code, this is for future iteration of the posts page */
const getSelectionList = (data: HomepageData, mailingListSelection: MailingListType | null) => {
  // If no mailing list selected, return shallow copy of original data
  if (!mailingListSelection) {
    return {
      active_posts: [...data.active_posts],
      today_in_history_posts: [...data.today_in_history_posts],
    };
  }

  // Single filter operation per category using the selected mailing list
  const filterByMailingList = (posts: any[]) => posts.filter((entry) => entry.dev_name === mailingListSelection);

  return {
    active_posts: filterByMailingList(data.active_posts),
    today_in_history_posts: filterByMailingList(data.today_in_history_posts),
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

const page = async ({ params }: { params: { path: string[] } }) => {
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

  const pageData = dataSelectionMap[params.path[0]];

  const createPostData = async (data: HomepageEntryData[]) => {
    const allPosts = await Promise.all(
      data.map(async (post) => {
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

    return allPosts;
  };

  const postsToDisplay = await createPostData(pageData.posts);

  return (
    <Wrapper>
      <div className='min-h-[calc(100vh-113px)] flex flex-col gap-8'>
        <DynamicHeader title={pageData.title} subtitle={pageData.subtitle} />

        <div className='flex items-center justify-between max-w-[866px] mx-auto w-full h-full'>
          <section className='flex flex-col gap-4 md:gap-6 pb-[44px]'>
            {!postsToDisplay.length ? (
              <p>Oops! No ongoing discussions this week. Check out the new posts above.</p>
            ) : (
              postsToDisplay.map((entry) => {
                return <PostsCard entry={entry} key={entry.id} />;
              })
            )}
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
