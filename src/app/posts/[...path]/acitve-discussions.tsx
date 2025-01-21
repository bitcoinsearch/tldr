import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export const ActiveDiscussions = ({ posts }: { posts: any[] }) => {
  const [sortKey, setSortKey] = React.useState<"newest" | "oldest">("newest");

  const memoizedNewsletters = React.useMemo(() => {
    switch (sortKey) {
      case "newest":
        return posts.sort((a, b) => b.issueNumber - a.issueNumber);
      case "oldest":
        return posts.sort((a, b) => a.issueNumber - b.issueNumber);
      default:
        return posts;
    }
  }, [posts, sortKey]);

  // const { currentPage, paginatedResult, setCurrentPage } = usePaginatedResult(memoizedNewsletters);
  const pageSize = 10;

  const pages = React.useMemo(() => Math.ceil((memoizedNewsletters?.length ?? 0) / pageSize), [memoizedNewsletters?.length]);

  return <div>ActiveDiscussions</div>;
};

export const DynamicHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
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
