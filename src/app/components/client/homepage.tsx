"use client";
import {
  BITCOINDEV,
  HomepageData,
  LIGHTNINGDEV,
  MailingListType,
} from "@/helpers/types";
import Image from "next/image";
import React, { useState } from "react";
import Post from "../server/post";

const Homepage = ({ data }: { data: HomepageData }) => {
  const [mailingListSelection, setMailingListSelection] = useState<
    Record<MailingListType, boolean>
  >({
    [BITCOINDEV]: true,
    [LIGHTNINGDEV]: true,
  });

  const getSelectionList = (data: HomepageData) => {
    let filteredSelection = {
      recent_posts: [...data.recent_posts],
      active_posts: [...data.active_posts],
    };
    if (
      mailingListSelection[BITCOINDEV] &&
      mailingListSelection[LIGHTNINGDEV]
    ) {
      return data;
    } else if (mailingListSelection[BITCOINDEV]) {
      filteredSelection.recent_posts = data.recent_posts.filter(
        (entry) => entry.dev_name === BITCOINDEV
      );
      filteredSelection.active_posts = data.active_posts.filter(
        (entry) => entry.dev_name === BITCOINDEV
      );
      return filteredSelection;
    } else {
      filteredSelection.recent_posts = data.recent_posts.filter(
        (entry) => entry.dev_name === LIGHTNINGDEV
      );
      filteredSelection.active_posts = data.active_posts.filter(
        (entry) => entry.dev_name === LIGHTNINGDEV
      );
      return filteredSelection;
    }
  };

  const homepageData = getSelectionList(data);

  const handleMailingListToggle = (name: MailingListType) => {
    // prevent toggling off both
    if (name === BITCOINDEV && mailingListSelection[LIGHTNINGDEV] === false) {
      return;
    }
    if (name === LIGHTNINGDEV && mailingListSelection[BITCOINDEV] === false) {
      return;
    }
    setMailingListSelection((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  return (
    <main className="">
      <h1 className="font-inika my-8 md:my-20 text-lg md:text-2xl text-gray-800">
        {data.header_summary}
      </h1>
      <div className="my-8">
        <MailingListToggle
          bitcoinDev={mailingListSelection[BITCOINDEV]}
          lightningDev={mailingListSelection[LIGHTNINGDEV]}
          handleToggle={handleMailingListToggle}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-12">
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
  bitcoinDev: boolean;
  lightningDev: boolean;
  handleToggle: (name: MailingListType) => void;
};

const MailingListToggle = ({
  bitcoinDev,
  lightningDev,
  handleToggle,
}: ToggleButtonProps) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleToggle(BITCOINDEV)}
        className={`flex gap-2 p-2 ${
          bitcoinDev ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-400"
        }  items-center rounded-md`}
      >
        <Image src="/images/btc.svg" alt="" width={16} height={16} />
        <p className="text-sm">Bitcoin-dev</p>
      </button>
      <button
        onClick={() => handleToggle(LIGHTNINGDEV)}
        className={`flex gap-2 p-2 ${
          lightningDev
            ? "bg-gray-800 text-gray-300"
            : "bg-gray-100 text-gray-400"
        } bg-gray-100  items-center rounded-md`}
      >
        <Image src="/images/lightning-dev.svg" alt="" width={16} height={16} />
        <p className="text-sm">Lightning-dev</p>
      </button>
    </div>
  );
};

export default Homepage;
