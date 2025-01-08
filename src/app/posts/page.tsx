import React from "react";
import Homepage from "@/app/components/client/homepage";
import { fetchAllActivityPosts, fetchAndProcessPosts } from "@/helpers/fs-functions";

export default async function page({ params, searchParams }: { params: { slug: string[] }; searchParams: { [key: string]: string | undefined } }) {
  let serverCount = [0];

  const data = await fetchAndProcessPosts();
  let batchData = [];

  if (data) {
    const { batch } = await fetchAllActivityPosts(0);
    batchData.push(...batch);
  }

  if (!data) return null;
  if (!batchData) return null;

  return (
    <div className='w-full mx-auto grow max-w-3xl pb-8 px-4 lg:px-0'>
      <Homepage data={data} batch={batchData} fetchMore={fetchAllActivityPosts} serverCount={serverCount} searchParams={searchParams} />;
    </div>
  );
}
