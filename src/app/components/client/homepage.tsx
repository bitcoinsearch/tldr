"use client";
import { BITCOINDEV, HomepageData, HomepageEntryData, LIGHTNINGDEV, MailingListType } from "@/helpers/types";
import { addSpaceAfterPeriods } from "@/helpers/utils";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Post from "../server/post";
import "../../globals.css";

const Homepage = ({
  data,
  batch,
  next,
  serverCount,
}: {
  data: HomepageData;
  batch: Array<HomepageEntryData>;
  next: (count: number) => Promise<{ batch: HomepageEntryData[]; count: number }>;
  serverCount: number[];
}) => {
  const [mailingListSelection, setMailingListSelection] = useState<MailingListType | null>(null);
  const [count, setCount] = useState(1);
  const [loading, setloading] = useState(false);

  const getSelectionList = (data: HomepageData) => {
    let filteredSelection = {
      recent_posts: [...data.recent_posts],
      active_posts: [...data.active_posts],
    };

    if (mailingListSelection === BITCOINDEV) {
      filteredSelection.recent_posts = data.recent_posts.filter((entry) => entry.dev_name === BITCOINDEV);
      filteredSelection.active_posts = data.active_posts.filter((entry) => entry.dev_name === BITCOINDEV);
    } else if (mailingListSelection === LIGHTNINGDEV) {
      filteredSelection.recent_posts = data.recent_posts.filter((entry) => entry.dev_name === LIGHTNINGDEV);
      filteredSelection.active_posts = data.active_posts.filter((entry) => entry.dev_name === LIGHTNINGDEV);
    }
    return filteredSelection;
  };

  const homepageData = getSelectionList(data);

  const handleMailingListToggle = (name: MailingListType) => {
    setMailingListSelection((prev) => (prev === name ? null : name));
  };

  const memoizedBatches = useMemo(() => {
    if (mailingListSelection === BITCOINDEV) {
      return batch.filter((batch) => batch.dev_name === BITCOINDEV);
    } else if (mailingListSelection === LIGHTNINGDEV) {
      return batch.filter((batch) => batch.dev_name === LIGHTNINGDEV);
    }
    return batch;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailingListSelection, batch, batch.length]);

  const outsideCount = count;
  const outSideServerCount = serverCount;

  const getNextBatch = async () => {
    setloading(true);

    try {
      const countValue =
        outsideCount === 1 && outsideCount <= serverCount[serverCount.length - 1]
          ? count + serverCount[serverCount.length - 1]
          : outsideCount === 1 && outSideServerCount[outSideServerCount.length - 1] >= 2
          ? count + 1
          : count;

      if (
        (outsideCount === 1 && outsideCount <= serverCount[serverCount.length - 1]) ||
        (outsideCount === 1 && outSideServerCount[outSideServerCount.length - 1] >= 2)
      ) {
        setCount((c) => c + serverCount[serverCount.length - 1]);
      }

      const res = await next(countValue);
      const { batch: currentBatch, count: funcCount } = res;
      batch.push(...currentBatch);

      serverCount.push(funcCount);
      setCount((c) => c + 1);

      setloading(false);

      return res;
    } catch (error) {
      setloading(false);
      console.error(error);
    }
  };

  return (
    <main className=''>
      <h1 className='font-inika my-8 md:my-20 text-lg md:text-2xl text-gray-800'>{addSpaceAfterPeriods(data.header_summary)}</h1>
      <div className='my-8'>
        <MailingListToggle selectedList={mailingListSelection} handleToggle={handleMailingListToggle} />
      </div>
      <div className='flex flex-col gap-12 break-words'>
        <section>
          <h2 className='text-xl md:text-4xl font-semibold pb-[60px]'>Active Discussions 🔥</h2>
          <div>
            {homepageData.active_posts.map((entry) => (
              <Post key={entry.id} entry={entry} isActivePost={true} />
            ))}
          </div>
        </section>
        <div className=''>
          <h2 className='text-xl md:text-4xl font-semibold pb-[60px]'>All Activity</h2>
          <div>
            {memoizedBatches?.map((entry, idx) => (
              <Post key={`${entry.id}_${idx}`} entry={entry} isActivePost={false} />
            ))}
          </div>
        </div>
        <section>
          <button
            className='border-2 border-black p-6 py-2 flex items-center justify-center text-lg font-medium'
            style={{ cursor: loading ? "not-allowed" : "pointer", pointerEvents: loading ? "none" : "visible" }}
            onClick={getNextBatch}
          >
            Next {loading ? <span className='ml-2 loader'></span> : null}
          </button>
        </section>
      </div>
    </main>
  );
};

type ToggleButtonProps = {
  selectedList: MailingListType | null;
  handleToggle: (name: MailingListType) => void;
};

const MailingListToggle = ({ selectedList, handleToggle }: ToggleButtonProps) => {
  return (
    <div className='flex flex-col gap-3'>
      <p className='text-2xl font-semibold leading-normal'>Filter by List</p>
      <div className='flex gap-6 items-center'>
        <button
          onClick={() => handleToggle(BITCOINDEV)}
          className={`flex gap-2 p-2 ${
            selectedList === BITCOINDEV ? "bg-gray-300 text-gray-500" : "bg-gray-100 text-gray-500"
          } items-center rounded-md`}
        >
          <Image src='/icons/bitcoin-dev_icon.svg' alt='' width={16} height={16} />
          <p className='text-xs text-black font-semibold'>Bitcoin-dev</p>
        </button>
        <button
          onClick={() => handleToggle(LIGHTNINGDEV)}
          className={`flex gap-2 p-2 ${
            selectedList === LIGHTNINGDEV ? "bg-gray-300 text-gray-500" : "bg-gray-100 text-gray-500"
          } items-center rounded-md`}
        >
          <Image src='/images/lightning-dev.svg' alt='' width={13.16} height={15.66} />
          <p className='text-xs font-semibold text-black'>Lightning-dev</p>
        </button>
      </div>
    </div>
  );
};

export default Homepage;
