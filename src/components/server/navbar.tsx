import Link from "next/link";
import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto h-[44px] px-4 mb-2 flex justify-between items-center">
      <Link href="/">
        <p className=" text-xl md:text-4xl font-[600] ">Bitcoin TLDR</p>
      </Link>
      <Searchbox />
    </div>
  );
};

export default Navbar;

export const Searchbox = () => {
  return (
    <div className="relative">
      <input
        name="searchbox"
        className="border-[1px] rounded-md border-[#ccc] w-[200px] md:w-[274px] py-2 pl-9"
        placeholder="search"
      />
      <Image
        className="absolute top-1/2 left-0 -translate-y-1/2 ml-2 pointer-events-none"
        src="/icons/search_icon.svg"
        alt="search_icon"
        width={24}
        height={24}
      />
      {/* <img className="absolute top-0 left-0" src="/icons/search_icon.svg" /> */}
    </div>
  );
};
