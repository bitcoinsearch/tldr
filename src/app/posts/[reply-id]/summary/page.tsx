import Wrapper from '@/app/components/server/wrapper';
import { ThreadSummary } from '@/app/summary/[...path]/components/thread-summary';
import { getSummaryData } from '@/helpers/fs-functions';
import { NextParamsPage, PostSummaryData } from '@/helpers/types';
import { hexToString } from '@/helpers/utils';
import { notFound } from 'next/navigation';
import React from 'react'

export const dynamic = "force-dynamic";

const SummaryPage = async ({params}:NextParamsPage ) => {
  const replyId = params["reply-id"] ? params["reply-id"].split("/")[0] : "";
  const allPath = replyId.split("-");

  const originalPostPath = hexToString(allPath[0]);
  const currReply = hexToString(allPath[1]);

  const originalPostData = await getSummaryData(originalPostPath.split("/"));
  const singleReplyData = await getSummaryData(currReply.split("/"));
  const fullPath = [...originalPostPath.split("/")]
  
  if((currReply === "404" && originalPostPath === "404") || !originalPostData?.data){
    return notFound();
  }

  const firstPost = originalPostData.data.historyLinks[0] || undefined;

  return (
    <Wrapper>
      <section>
        <ThreadSummary
          summaryData={originalPostData as PostSummaryData}
          originalPostLink={allPath[0]}
          params={{ path: fullPath }}
          currentReplyLink={allPath[1]}
          isPostSummary
          currentReplyData={singleReplyData as PostSummaryData}
          firstPost={firstPost}
        />
      </section>
    </Wrapper>
  );
}

export default SummaryPage