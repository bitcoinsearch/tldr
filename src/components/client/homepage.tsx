"use client";
import { FakeDataType } from "@/app/page";
import { BITCOINDEV, LIGHTNINGDEV, MailingListType } from "@/helpers/types";
import Image from "next/image";
import React, { useState } from "react";
import Post from "./post";

const Homepage = ({ data }: { data: FakeDataType }) => {
  const [mailingListSelection, setMailingListSelection] = useState<
    Record<MailingListType, boolean>
  >({
    [BITCOINDEV]: true,
    [LIGHTNINGDEV]: true,
  });
  const mailingListSection: Record<
    MailingListType,
    FakeDataType["enteries"]
  > = {
    [BITCOINDEV]: [],
    [LIGHTNINGDEV]: [],
  };
  data.enteries.forEach((entry) => {
    const dev_name = entry.dev_name as MailingListType;
    mailingListSection[dev_name].push(entry);
    // if (entry.summary.dev_name === BITCOINDEV) {
    //   mailingListSection[BITCOINDEV].push(entry)
    // } else if (entry.summary.dev_name === BITCOINDEV)
  });
  const handleMailingListToggle = (name: MailingListType) => {
    setMailingListSelection((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  return (
    <main className="">
      <h1 className="font-inika my-20 text-2xl text-gray-800">
        {data.header_summary}
      </h1>
      <div className="my-8">
        <MailingListToggle handleToggle={handleMailingListToggle} />
      </div>
      <div className="flex gap-12">
        <section>
          <h2 className="text-4xl font-semibold">Active Discussions 🔥</h2>
          <div>
            {data.enteries.map((entry, idx) => (
              <Post key={idx} entry={entry} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-4xl font-semibold">Recent Discussions 🪄</h2>
          <div>
            {data.enteries.map((entry, idx) => (
              <Post key={idx} entry={entry} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

type ToggleButtonProps = {
  name?: MailingListType;
  iconPath?: string;
  handleToggle: (name: MailingListType) => void;
};

const MailingListToggle = ({
  name,
  iconPath,
  handleToggle,
}: ToggleButtonProps) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleToggle(BITCOINDEV)}
        className="flex gap-2 p-2 bg-gray-100 hover:bg-gray-300 text-gray-400 hover:text-gray-500 items-center rounded-md"
      >
        <Image src="/images/btc.svg" alt="" width={16} height={16} />
        <p className="text-sm">Bitcoin-dev</p>
      </button>
      <button
        onClick={() => handleToggle(LIGHTNINGDEV)}
        className="flex gap-2 p-2 bg-gray-100 hover:bg-gray-300 text-gray-400 hover:text-gray-500 items-center rounded-md"
      >
        <Image src="/images/lightning-dev.svg" alt="" width={16} height={16} />
        <p className="text-sm">Lightning-dev</p>
      </button>
    </div>
  );
};

export default Homepage;
