import Link from "next/link";
import React from "react";

import SearchBox from "../client/search-modal";
import TanstackProvider from "@/app/provider";

const Navbar = () => {
  return (
    <div className="w-full max-w-3xl mx-auto h-[44px] mb-2 flex justify-between items-center">
      <Link href="/">
        <p className="text-xl md:text-4xl font-[600]">Bitcoin TLDR</p>
      </Link>
      <TanstackProvider>
        <SearchBox />
      </TanstackProvider>
    </div>
  );
};

export default Navbar;
