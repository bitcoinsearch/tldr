"use client";
import { HomepageData, HomepageEntryData, MailingListType } from "@/helpers/types";
import { addSpaceAfterPeriods } from "@/helpers/utils";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Post from "../server/post";
import "../../globals.css";
import { BITCOINDEV, LIGHTNINGDEV } from "@/config/config";

const Homepage = ({
  data,
  batch,
  fetchMore,
  serverCount,
}: {
  data: HomepageData;
  batch: Array<HomepageEntryData>;
  fetchMore: (count: number) => Promise<{ batch: HomepageEntryData[]; count: number }>;
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

  const initialCount = count;
  const fetchCountArr = serverCount;

  const getNextBatch = async () => {
    setloading(true);

    try {
      const lastClickCount = serverCount[serverCount.length - 1];
      const lastFetchCount = fetchCountArr[fetchCountArr.length - 1];
      const isLastClickCountGreater = initialCount === 1 && initialCount <= lastClickCount;
      const isLastFectchCountGreater = initialCount === 1 && lastFetchCount >= 2;

      let countValue;
      if (isLastClickCountGreater) {
        countValue = count + lastClickCount;
      } else if (isLastFectchCountGreater) {
        countValue = count + 1;
      } else {
        countValue = count;
      }

      if (isLastClickCountGreater || isLastFectchCountGreater) {
        setCount((c) => c + lastClickCount);
      }

      const res = await fetchMore(countValue);
      if (res) {
        const { batch: currentBatch, count: funcCount } = res;
        batch.push(...currentBatch);

        serverCount.push(funcCount);
        setCount((c) => c + 1);

        setloading(false);
      }
    } catch (error) {
      setloading(false);
      console.error(error);
    }
  };

  return (
    <main className=''>
      <div className="flex flex-col gap-6 md:gap-8 my-8 md:my-14">
        <h2 className='text-2xl font-semibold leading-normal'>Your daily summary</h2>
        <div>
          {formatTextToParagraphs(data.header_summary)}
        </div>
      </div>
      <div className='mb-14'>
        <MailingListToggle selectedList={mailingListSelection} handleToggle={handleMailingListToggle} />
      </div>
      <div className='flex flex-col gap-12 break-words'>
        <section>
          <h2 className='text-xl md:text-4xl font-semibold pb-8'>Active Discussions 🔥</h2>
          <div>
            {homepageData.active_posts.map((entry) => (
              <Post key={entry.id} entry={entry} isActivePost={true} />
            ))}
          </div>
        </section>
        <div className=''>
          <h2 className='text-xl md:text-4xl font-semibold pb-8'>All Activity</h2>
          <div>
            {memoizedBatches?.map((entry, idx) => (
              <Post key={`${entry.id}_${idx}`} entry={entry} isActivePost={false} />
            ))}
          </div>
        </div>
        <section className='flex justify-center'>
          <button
            className={`border-2 border-black p-6 py-2 flex items-center justify-center text-lg font-medium ${
              loading ? `cursor-not-allowed pointer-events-none` : `cursor-pointer pointer-events-auto`
            }`}
            onClick={getNextBatch}
          >
            Fetch more {loading ? <span className='ml-2 loader'></span> : null}
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


const formatTextToParagraphs = (text: string) => {
  const spacedText = addSpaceAfterPeriods(text);

  return spacedText.split(/\n\n+/).map((paragraph, index) => (
    <p key={index} className="font-inika text-sm md:text-lg text-gray-800 my-4">
      {paragraph}
    </p>
  ));
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
