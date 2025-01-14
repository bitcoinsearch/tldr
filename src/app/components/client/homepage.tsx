"use client";
import { HomepageData, HomepageEntryData, MailingListType } from "@/helpers/types";
import { addSpaceAfterPeriods } from "@/helpers/utils";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Post from "../server/post";
import { BITCOINDEV, DELVINGBITCOIN, LIGHTNINGDEV } from "@/config/config";
import ScrollToTopButton from "./scroll-to-top";
import MailchimpSubscribeForm from "./subscribe-to-newsletter";
import { MarkdownWrapper } from "../server/MarkdownWrapper";

const Homepage = ({
  data,
  batch,
  fetchMore,
  serverCount,
  searchParams,
}: {
  data: HomepageData;
  batch: Array<HomepageEntryData>;
  fetchMore: (count: number) => Promise<{ batch: HomepageEntryData[]; count: number }>;
  serverCount: number[];
  searchParams: { [key: string]: string | undefined };
}) => {
  const [mailingListSelection, setMailingListSelection] = useState<MailingListType | null>(searchParams.dev as MailingListType);
  const [count, setCount] = useState(1);
  const [loading, setloading] = useState(false);

  const getSelectionList = (data: HomepageData) => {
    // If no mailing list selected, return shallow copy of original data
    if (!mailingListSelection || searchParams.dev === undefined) {
      return {
        active_posts: [...data.active_posts],
        today_in_history_posts: [...data.today_in_history_posts],
        recent_posts: [...data.recent_posts],
      };
    }

    // Single filter operation per category using the selected mailing list
    const filterByMailingList = (posts: any[]) => posts.filter((entry) => entry.dev_name === mailingListSelection);

    return {
      active_posts: filterByMailingList(data.active_posts),
      today_in_history_posts: filterByMailingList(data.today_in_history_posts),
      recent_posts: filterByMailingList(data.recent_posts),
    };
  };

  const homepageData = getSelectionList(data);

  const handleMailingListToggle = (name: MailingListType) => {
    setMailingListSelection((prev) => (prev === name ? null : name));
  };

  const memoizedBatches = useMemo(() => {
    const filterBatch = batch.filter((batch) => batch.dev_name === mailingListSelection);

    if (mailingListSelection === BITCOINDEV) {
      return batch.filter((batch) => batch.dev_name === BITCOINDEV);
    } else if (mailingListSelection === LIGHTNINGDEV) {
      return batch.filter((batch) => batch.dev_name === LIGHTNINGDEV);
    } else if (mailingListSelection === DELVINGBITCOIN) {
      return batch.filter((batch) => batch.dev_name === DELVINGBITCOIN);
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
      <div className='flex flex-col gap-6 md:gap-8 my-8 md:my-14'>
        <h2 className='text-2xl font-semibold leading-normal'>Your daily summary</h2>
        <MarkdownWrapper summary={data.header_summary} className={`font-inika text-sm md:text-lg text-gray-800`} />
        <MailchimpSubscribeForm />
      </div>
      <div className='mb-14'>
        <MailingListToggle selectedList={mailingListSelection} handleToggle={handleMailingListToggle} />
      </div>
      <div className='flex flex-col gap-12 break-words'>
        <section>
          <h2 className='text-xl md:text-4xl font-semibold pb-8' id='active-discussions'>
            Active Discussions 🔥
          </h2>
          <div>
            {homepageData.active_posts.length ? (
              <>
                {homepageData.active_posts.map((entry) => (
                  <Post key={entry.id} entry={entry} isActivePost={true} />
                ))}
              </>
            ) : (
              <p>No active discussions available, kindly explore other sections.</p>
            )}
          </div>
        </section>
        <section>
          <h2 className='text-xl md:text-4xl font-semibold pb-8' id='historic-conversations'>
            Today in Bitcoin/LN History
          </h2>
          <div>
            {homepageData.today_in_history_posts.length ? (
              <>
                {homepageData.today_in_history_posts.map((entry) => (
                  <Post key={entry.id} entry={entry} isActivePost={false} />
                ))}
              </>
            ) : (
              <p>Posts in this section are currently unavailable. Kindly explore other sections.</p>
            )}
          </div>
        </section>
        <div className=''>
          <h2 className='text-xl md:text-4xl font-semibold pb-8' id='all-activity'>
            All Activity
          </h2>
          <div>
            {memoizedBatches.length ? (
              <>
                {memoizedBatches?.map((entry, idx) => (
                  <Post key={`${entry.id}_${idx}`} entry={entry} isActivePost={false} />
                ))}
              </>
            ) : (
              <p>Posts in this section are currently unavailable. Kindly explore other sections.</p>
            )}
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
      <ScrollToTopButton />
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
    <p key={index} className='font-inika text-sm md:text-lg text-gray-800 my-4'>
      {paragraph}
    </p>
  ));
};

const MailingListToggle = ({ selectedList, handleToggle }: ToggleButtonProps) => {
  return (
    <div className='flex flex-col gap-3'>
      <p className='text-2xl font-semibold leading-normal' id='source'>
        Filter by List
      </p>
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
        <button
          onClick={() => handleToggle(DELVINGBITCOIN)}
          className={`flex gap-2 p-2 ${
            selectedList === DELVINGBITCOIN ? "bg-gray-300 text-gray-500" : "bg-gray-100 text-gray-500"
          } items-center rounded-md`}
        >
          <Image src='/icons/delvingbitcoin_icon.svg' alt='' width={20} height={20} />
          <p className='text-xs font-semibold text-black'>Delving bitcoin</p>
        </button>
      </div>
    </div>
  );
};

export default Homepage;
