"use client";

import { SortKey } from "@/helpers/types";
import Image from "next/image";
import React, { useCallback } from "react";
import BitcoinDevIcon from "./icons/bitcoin-dev-icon";
import DelvingBitcoinIcon from "./icons/delving-bitcoin-icon";

type CategoriesProps = {
  setSortKey: React.Dispatch<React.SetStateAction<SortKey>>;
  sortKey: SortKey;
};
const CategoriesNavigation: React.FC<CategoriesProps> = ({
  sortKey,
  setSortKey,
}) => {
  
  const getActiveClass = useCallback((key: SortKey) => {
    if (sortKey === key) return "bg-orange-custom-100 text-white";
    return "bg-gray-custom-1000";
  }, [sortKey]);

  return (
    <section className="flex items-center gap-2">
      <button
        className={`text-base leading-[22.56px] capitalize   px-2 py-[2px] rounded-full ${getActiveClass(
          "all"
        )}`}
        onClick={() => setSortKey("all")}
      >
        All
      </button>
      <button
        className={`hidden sm:flex items-center gap-1 bg-gray-custom-1000 rounded-full px-2 py-[2.5px] w-fit ${getActiveClass(
          "delvingbitcoin"
        )}`}
        onClick={() => setSortKey("delvingbitcoin")}
      >
       <DelvingBitcoinIcon className={`${sortKey === "delvingbitcoin" ? "text-white" : ""}`}/>
        <p className="text-base leading-[22.56px] capitalize">
          Delving Bitcoin
        </p>
      </button>
      <button
        className={`hidden sm:flex items-center gap-1 bg-gray-custom-1000 rounded-full px-2 py-[2.5px] w-fit ${getActiveClass(
          "bitcoin-dev"
        )}`}
        onClick={() => setSortKey("bitcoin-dev")}
      >
        <BitcoinDevIcon className={`${sortKey === "bitcoin-dev" ? "" : "text-orange-custom-100"}`}/>
        <p className="text-base leading-[22.56px] capitalize">Bitcoin Dev</p>
      </button>
    </section>
  );
};

export default CategoriesNavigation;
