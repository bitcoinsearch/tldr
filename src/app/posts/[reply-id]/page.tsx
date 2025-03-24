import { MarkdownWrapper } from "@/app/components/server/MarkdownWrapper";
import Wrapper from "@/app/components/server/wrapper";
import { ThreadSummary } from "@/app/summary/[...path]/components/thread-summary";
import { getSummaryData } from "@/helpers/fs-functions";
import { PostSummaryData } from "@/helpers/types";
import { hexToString } from "@/helpers/utils";
import { split } from "postcss/lib/list";
import Markdown from "react-markdown";

const ReplyPage = async ({ params }: any) => {
  const replyId = params["reply-id"].split("/")[0];
  const allPath = replyId.split("-");
  const originalPostPath = hexToString(allPath[0]);
  const currReply = hexToString(allPath[1]);

  const originalPostData = await getSummaryData(originalPostPath.split("/"));
  const singleReplyData = await getSummaryData(currReply.split("/"));

  const fullPath = [...originalPostPath.split("/")]
  return (
    <Wrapper>
      <section>
        <ThreadSummary
          summaryData={originalPostData as PostSummaryData}
          originalPostLink={allPath[0]}
          params={{ path: fullPath }}
          currentReplyLink={allPath[1]}
          currentReplyData={singleReplyData as PostSummaryData}
        />
      </section>
    </Wrapper>
  );
};

export default ReplyPage;
