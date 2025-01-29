import { formattedDate, getSummaryDataInfo } from "@/helpers/utils";
import * as fs from "fs";
import DiscussionHistory from "./components/historythread";
import Link from "next/link";
import BreadCrumbs from "./components/BreadCrumb";
import { MarkdownWrapper } from "@/app/components/server/MarkdownWrapper";
import Wrapper from "@/app/components/server/wrapper";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { ThreadSummary } from "./components/thread-summary";

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

  const postBreadcrumbData = () => {
    /**
     * routes to account for:
     * - Home
     * - dev_name
     * - topic
     * - Thread Summary
     * - Authors
     */

    const devName = params.path[0];

    const routes = [
      {
        name: "Home",
        link: "/",
      },
      {
        name: devName,
        link: `/posts?source=all-activity&dev=${devName}`,
      },
      {
        name: "Thread Summary",
        link: `/summary/${params.path.join("/")}`,
      },
    ];

    return routes;
  };

  const routes = postBreadcrumbData();

  return (
    <Wrapper>
      <div>
        <div>
          <div className='pt-5 md:pt-[54px]'>
            <Link href='/' className='flex items-center gap-2 py-2 px-4 md:px-6 rounded-full border border-black w-fit'>
              <ArrowLeftIcon className='w-5 h-5 md:w-6 md:h-6' strokeWidth={4} />
              <span className='text-sm md:text-base font-medium md:font-normal font-gt-walsheim leading-[18.32px]'>Back to Active Discussions</span>
            </Link>
          </div>

          {/* breadcrumb */}
          <>
            <section className='flex items-center py-6'>
              {routes.map((link, index) => (
                <div key={link.name} className='flex items-center'>
                  <Link
                    href={link.link}
                    key={link.name}
                    className='text-sm md:text-base font-medium md:font-normal font-gt-walsheim leading-[18.32px] text-gray-custom-1100'
                  >
                    {link.name}
                  </Link>
                  {index !== routes.length - 1 && <p className='text-gray-custom-1200 px-[5px]'>/</p>}
                </div>
              ))}
            </section>
          </>
        </div>

        <ThreadSummary summaryData={summaryData} searchParams={searchParams} />
      </div>
    </Wrapper>
  );
}
