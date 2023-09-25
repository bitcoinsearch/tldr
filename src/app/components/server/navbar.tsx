import Link from "next/link";
import React from "react";

import SearchBox from "../client/search-modal";

const Navbar = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto h-[44px] mb-2 flex justify-between items-center">
      <Link href="/">
        <p className=" text-xl md:text-4xl font-[600] ">Bitcoin TLDR</p>
      </Link>
      <SearchBox />
    </div>
  );
};

export default Navbar;
