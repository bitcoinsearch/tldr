"use client";
import { BITCOINDEV, HomepageData, HomepageEntryData, LIGHTNINGDEV, MailingListType } from "@/helpers/types";
import { addSpaceAfterPeriods } from "@/helpers/utils";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Post from "../server/post";
import "../../globals.css";

const Homepage = ({ data, batch }: { data: HomepageData; batch: Array<HomepageEntryData> }) => {
  const [mailingListSelection, setMailingListSelection] = useState<MailingListType | null>(null);

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
  }, [mailingListSelection, batch]);

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
          <>
            {memoizedBatches?.map((entry, idx) => (
              <Post key={`${entry.id}_${idx}`} entry={entry} isActivePost={false} />
            ))}
          </>
        </div>
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
            selectedList === BITCOINDEV
              ? "bg-gray-300 text-gray-500"
              : "bg-gray-100 text-gray-500"
          } items-center rounded-md`}
        >
          <Image src='/icons/bitcoin-dev_icon.svg' alt='' width={16} height={16} />
          <p className='text-xs text-black font-semibold'>Bitcoin-dev</p>
        </button>
        <button
          onClick={() => handleToggle(LIGHTNINGDEV)}
          className={`flex gap-2 p-2 ${
            selectedList === LIGHTNINGDEV
              ? "bg-gray-300 text-gray-500"
              : "bg-gray-100 text-gray-500"
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
