"use client";
import {
  BITCOINDEV,
  HomepageData,
  LIGHTNINGDEV,
  MailingListType,
} from "@/helpers/types";
import { addSpaceAfterPeriods } from "@/helpers/utils";
import Image from "next/image";
import React, { useState } from "react";
import Post from "../server/post";

const Homepage = ({ data }: { data: HomepageData }) => {
  const [mailingListSelection, setMailingListSelection] = useState<MailingListType | null>(null);

  const getSelectionList = (data: HomepageData) => {
    let filteredSelection = {
      recent_posts: [...data.recent_posts],
      active_posts: [...data.active_posts],
    };

    if (mailingListSelection === BITCOINDEV) {
      filteredSelection.recent_posts = data.recent_posts.filter(
        (entry) => entry.dev_name === BITCOINDEV
      );
      filteredSelection.active_posts = data.active_posts.filter(
        (entry) => entry.dev_name === BITCOINDEV
      );
    } else if (mailingListSelection === LIGHTNINGDEV) {
      filteredSelection.recent_posts = data.recent_posts.filter(
        (entry) => entry.dev_name === LIGHTNINGDEV
      );
      filteredSelection.active_posts = data.active_posts.filter(
        (entry) => entry.dev_name === LIGHTNINGDEV
      );
    }
    return filteredSelection;
  };

  const homepageData = getSelectionList(data);

  const handleMailingListToggle = (name: MailingListType) => {
    setMailingListSelection((prev) =>
      prev === name ? null : name
    );
  };
  return (
    <main className="">
      <h1 className="font-inika my-8 md:my-20 text-lg md:text-2xl text-gray-800">
        {addSpaceAfterPeriods(data.header_summary)}
      </h1>
      <div className="my-8">
        <MailingListToggle
          selectedList={mailingListSelection}
          handleToggle={handleMailingListToggle}
        />
      </div>
      <div className="grid grid-cols-2 gap-12 break-words">
        <section>
          <h2 className="text-xl md:text-4xl font-semibold">
            Active Discussions 🔥
          </h2>
          <div>
            {homepageData.active_posts.map((entry) => (
              <Post key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl md:text-4xl font-semibold">
            Recent Posts 🪄
          </h2>
          <div>
            {homepageData.recent_posts.map((entry, idx) => (
              <Post key={idx} entry={entry} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

type ToggleButtonProps = {
  selectedList: MailingListType | null;
  handleToggle: (name: MailingListType) => void;
};

const MailingListToggle = ({
  selectedList,
  handleToggle,
}: ToggleButtonProps) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleToggle(BITCOINDEV)}
        className={`flex gap-2 p-2 ${
          selectedList === BITCOINDEV
            ? "bg-gray-300 text-gray-500"
            : "bg-gray-100 text-gray-500"
        } items-center rounded-md`}
      >
        <Image src="/images/btc.svg" alt="" width={16} height={16} />
        <p className="text-sm">Bitcoin-dev</p>
      </button>
      <button
        onClick={() => handleToggle(LIGHTNINGDEV)}
        className={`flex gap-2 p-2 ${
          selectedList === LIGHTNINGDEV
            ? "bg-gray-300 text-gray-500"
            : "bg-gray-100 text-gray-500"
        } items-center rounded-md`}
      >
        <Image src="/images/lightning-dev.svg" alt="" width={16} height={16} />
        <p className="text-sm">Lightning-dev</p>
      </button>
    </div>
  );
};

export default Homepage;
