import Link from "next/link";
import React from "react";

import SearchBox from "../client/search-modal";
import TanstackProvider from "@/app/provider";
import Menu from "../client/navigation-menu";

const Navbar = () => {
  return (
    <div className='w-full max-w-3xl mx-auto mt-2'>
      <div className='flex justify-between items-center'>
        <Link href='/'>
          <p className='text-xl md:text-4xl font-[600]'>Bitcoin TLDR</p>
        </Link>
        <div className='flex gap-4 items-center justify-center'>
          <TanstackProvider>
            <SearchBox />
          </TanstackProvider>
          <Menu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
