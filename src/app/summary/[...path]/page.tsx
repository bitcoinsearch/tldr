import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Wrapper from "@/app/components/server/wrapper";
import { stringToHex } from "@/helpers/utils";
import { ThreadSummary } from "./components/thread-summary";
import { getSummaryData } from "@/helpers/fs-functions";
import { notFound } from "next/navigation";


export default async function Page({ params }: { params: { path: string[] }; searchParams: { replies: string } }) {
  const summaryData = await getSummaryData(params.path);
  const hexString = stringToHex(params.path.join("/"));

  if (!summaryData) return notFound();



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

      <ThreadSummary isPostSummary summaryData={summaryData}  originalPostLink={hexString} params={params} />
    </Wrapper>
  );
}
