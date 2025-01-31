import * as fs from "fs";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Wrapper from "@/app/components/server/wrapper";
import { getSummaryDataInfo } from "@/helpers/utils";
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

  const handleRepliesCallback = async (path: string) => {
    "use server";
    const summaryData = await getSummaryData(path.split("/"));
    if (!summaryData) return null;

    return summaryData;
  };

  return (
    <Wrapper>
      <div>
        <div className='pt-5 md:pt-[54px]'>
          <Link href='/posts#all-activity' className='flex items-center gap-2 py-2 px-4 md:px-6 rounded-full border border-black w-fit'>
            <ArrowLeftIcon className='w-5 h-5 md:w-6 md:h-6' strokeWidth={4} />
            <span className='text-sm md:text-base font-medium md:font-normal font-gt-walsheim leading-[18.32px]'>Back to Active Discussions</span>
          </Link>
        </div>
      </div>

      <ThreadSummary summaryData={summaryData} searchParams={searchParams} handleRepliesCallback={handleRepliesCallback} params={params} />
    </Wrapper>
  );
}
