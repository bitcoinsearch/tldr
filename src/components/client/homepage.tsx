"use client";
import { FakeDataType } from "@/app/page";
import { BITCOINDEV, LIGHTNINGDEV, MailingListType } from "@/helpers/types";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Post from "./post";

type SeparatedMailingList = Record<MailingListType, FakeDataType["enteries"]>;

const Homepage = ({ data }: { data: FakeDataType }) => {
  const [mailingListSelection, setMailingListSelection] = useState<
    Record<MailingListType, boolean>
  >({
    [BITCOINDEV]: true,
    [LIGHTNINGDEV]: true,
  });
  // const separatedMailingList = useMemo(() => {
  //   const separatedList: SeparatedMailingList = {
  //     [BITCOINDEV]: [],
  //     [LIGHTNINGDEV]: [],
  //   };
  //   data.enteries.forEach((entry) => {
  //     const dev_name = entry.dev_name as MailingListType;
  //     separatedMailingList[dev_name].push(entry);
  //   });
  //   return separatedList;
  // }, [data]);

  const getSelectionList = (data: FakeDataType) => {
    if (
      mailingListSelection[BITCOINDEV] &&
      mailingListSelection[LIGHTNINGDEV]
    ) {
      return data.enteries;
    } else if (mailingListSelection[BITCOINDEV]) {
      return data.enteries.filter((entry) => entry.dev_name === BITCOINDEV);
    } else {
      return data.enteries.filter((entry) => entry.dev_name === LIGHTNINGDEV);
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
      <h1 className="font-inika my-20 text-2xl text-gray-800">
        {data.header_summary}
      </h1>
      <div className="my-8">
        <MailingListToggle
          bitcoinDev={mailingListSelection[BITCOINDEV]}
          lightningDev={mailingListSelection[LIGHTNINGDEV]}
          handleToggle={handleMailingListToggle}
        />
      </div>
      <div className="flex gap-12">
        <section>
          <h2 className="text-4xl font-semibold">Active Discussions 🔥</h2>
          <div>
            {homepageData.map((entry, idx) => (
              <Post key={idx} entry={entry} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-4xl font-semibold">Recent Discussions 🪄</h2>
          <div>
            {homepageData.map((entry, idx) => (
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
        className={`flex gap-2 p-2 ${bitcoinDev? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-400"}  items-center rounded-md`}
      >
        <Image src="/images/btc.svg" alt="" width={16} height={16} />
        <p className="text-sm">Bitcoin-dev</p>
      </button>
      <button
        onClick={() => handleToggle(LIGHTNINGDEV)}
        className={`flex gap-2 p-2 ${lightningDev? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-400"} bg-gray-100  items-center rounded-md`}
      >
        <Image src="/images/lightning-dev.svg" alt="" width={16} height={16} />
        <p className="text-sm">Lightning-dev</p>
      </button>
    </div>
  );
};

export default Homepage;
