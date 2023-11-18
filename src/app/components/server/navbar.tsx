import Link from "next/link";
import React from "react";

import SearchBox from "../client/search-modal";
import TanstackProvider from "@/app/provider";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-2">
      <Link href="/rss.xml" target="_blank" about="tldr-rss-feed">
        <Image
          src="/icons/feed_icon.svg"
          alt="tldr-rss-feed"
          width={22}
          height={22}
          className="mb-1"
        />
      </Link>
      <div className="flex justify-between items-center">
        <Link href="/">
          <p className="text-xl md:text-4xl font-[600]">Bitcoin TLDR</p>
        </Link>
        <TanstackProvider>
          <SearchBox />
        </TanstackProvider>
      </div>
    </div>
  );
};

export default Navbar;
