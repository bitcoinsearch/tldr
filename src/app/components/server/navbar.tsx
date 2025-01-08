import React from "react";
import Link from "next/link";
import Image from "next/image";
import Wrapper from "./wrapper";

import AppMenu from "../client/navigation-menu";
import TanstackProvider from "@/app/provider";
import SearchBox from "../client/search-modal";

const Navbar = () => {
  return (
    <div className='bg-gray-custom-20 -z-10 bg-orange-custom-200'>
      <Wrapper className='flex items-center justify-between py-8 z-50'>
        <Link href='/' className='flex items-center'>
          <Image src='/icons/bitcoin-logo-icon.svg' alt='Bitcoin Logo' width={32} height={32} />
          <p className='text-xl font-medium font-gt-walsheim'>TLDR</p>
        </Link>

        <div className='flex gap-10 items-center justify-center font-gt-walsheim font-medium text-lg leading-[20.61px]'>
          <Link href='/newsletter'>Newsletters</Link>
          <Link href='/posts'>Posts</Link>
          <Link href='/about'>About</Link>
          <section className='flex items-center gap-6'>
            <TanstackProvider>
              <SearchBox />
            </TanstackProvider>
            <AppMenu />
          </section>
        </div>
      </Wrapper>
    </div>
  );
};

export default Navbar;
