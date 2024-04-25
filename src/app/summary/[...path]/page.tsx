import { formattedDate, getSummaryData } from "@/helpers/utils";
import DiscussionHistory from "./components/historythread";
import Link from "next/link";
import BreadCrumbs from "./components/BreadCrumb";
import { MarkdownWrapper } from "@/app/components/server/MarkdownWrapper";

export default async function Page({ params, searchParams }: { params: { path: string[] }; searchParams: { replies: string } }) {
  const summaryData = await getSummaryData(params.path);
  if (!summaryData) return <h1>No data found</h1>;
  const splitSentences = summaryData.data.entry.summary.split(/(?<=[.!?])\s+/);
  const firstSentence = splitSentences[0];
  const newSummary = summaryData.data.entry.summary.replace(firstSentence, "");
  const { authors, historyLinks, entry } = summaryData.data;
  const { link } = entry;
  const publishedAtDateDisplay = formattedDate(entry.published);
  const isCombinedPage = params.path[2].startsWith("combined");

  return (
    <main>
      <div className='flex flex-col gap-4 my-10'>
        <BreadCrumbs params={params} summaryData={summaryData} replies={searchParams.replies} />
        <h2 className='font-inika text-4xl'>{summaryData.data.title}</h2>
        <div className={`flex flex-col`}>
          <div className='flex items-center gap-2'>
            {historyLinks && historyLinks?.length == 0 && link ? (
              <Link href={link} target='_blank'>
                <span className='pb-[2px] border-b-2 border-brand-secondary leading-relaxed text-brand-secondary font-semibold'>Original Post</span>
              </Link>
            ) : null}
            {authors.length === 1 ? <span className='text-gray-600 font-semibold'>by {authors[0].name}</span> : null}
          </div>
          {isCombinedPage ? null : (
            <h3 className=' text- font-medium pt-3'>
              <span className=' mr-1 font- text-gray-600'>Posted on: </span>
              {publishedAtDateDisplay}
            </h3>
          )}
        </div>
      </div>
      <section className='my-10'>
        <MarkdownWrapper summary={firstSentence} className='text-2xl font-inika my-2' />
        <MarkdownWrapper summary={newSummary} className='whitespace-pre-line summaryTags' />
      </section>
      {historyLinks && historyLinks?.length > 0 ? (
        <DiscussionHistory historyLinks={historyLinks} authors={authors} replies={searchParams.replies} />
      ) : null}
    </main>
  );
}
