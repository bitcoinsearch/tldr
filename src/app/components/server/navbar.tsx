"use client";

import Link from "next/link";
import Image from "next/image";
import Wrapper from "./wrapper";
import { usePathname, useRouter } from "next/navigation";
import TanstackProvider from "@/app/provider";
import SearchBox from "../client/search-modal";
import AppMenu from "../client/navigation-menu";
import React, { SetStateAction, useState } from "react";
import { CaretDownIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { MobileNavLinks } from "@/data";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
  }, [open]);

  return (
    <div className='bg-gray-custom-20 -z-10 bg-white md:bg-orange-custom-200'>
      <Wrapper className='flex items-center justify-between pt-[30px] md:pt-8 z-50'>
        <Link href='/' className='flex items-center'>
          <Image src='/icons/bitcoin-logo-icon.svg' alt='Bitcoin Logo' width={32} height={32} />
          <p className='text-xl font-medium font-gt-walsheim'>TLDR</p>
        </Link>

        <div className='flex gap-5 lg:gap-10 items-center justify-center font-gt-walsheim font-medium text-base lg:text-lg leading-[20.61px]'>
          <nav className='hidden md:flex items-center gap-5 lg:gap-10'>
            <Link href='/newsletter'>Newsletters</Link>
            <Link href='/posts'>Posts</Link>
            <Link href='/about'>About</Link>
          </nav>
          <section className='flex items-center gap-5 lg:gap-6'>
            <TanstackProvider>
              <SearchBox />
            </TanstackProvider>
            <AppMenu />
            <button className='md:hidden max-md:flex h-8 w-8 items-center justify-center' onClick={() => setOpen(!open)}>
              {open ? <Image src='/icons/close-icon.svg' width={32} height={32} alt='Close Icon' /> : <HamburgerMenuIcon className='w-8 h-8' />}
            </button>
          </section>
        </div>

        {open ? (
          <div className='w-full bg-white top-[86px] left-0 right-0 bottom-0 p-4 z-40 pt-3 pb-8 overflow-scroll md:hidden max-md:fixed'>
            <MobileMenu setOpen={setOpen} />
          </div>
        ) : null}
      </Wrapper>
    </div>
  );
};

const MobileMenu = ({ setOpen }: { setOpen: React.Dispatch<SetStateAction<boolean>> }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [subMenu, setSubMenu] = useState(false);
  const hash = window.location.hash.replace("#", "");
  const currentPath = pathname && pathname.split("/")[1];

  const handleClick = (href: string, isSubMenu: boolean) => {
    if (isSubMenu) {
      setSubMenu(!subMenu);
    } else {
      router.push(href);
      setOpen(false);
    }
  };

  return (
    <div className='flex flex-col gap-6 bg-white min-h-full overflow-y-scroll'>
      <section className='flex-col gap-2'>
        <div className='w-full flex flex-col gap-8'>
          {MobileNavLinks.map((link) => (
            <div key={link.title}>
              <button
                key={link.title}
                onClick={() => handleClick(link.href, link.isSubMenu)}
                className={`text-black font-medium text-lg leading-[20.61px] font-gt-walsheim text-start flex items-center justify-between w-full max-w-[253px] ${
                  currentPath === link.href.split("/")[1] ? "text-orange-custom-100 font-bold" : "text-black"
                }`}
              >
                {link.title}
                {link.isSubMenu && (
                  <span className='' onClick={() => setSubMenu(!subMenu)}>
                    <CaretDownIcon className='w-5 h-5' />
                  </span>
                )}
              </button>

              {/* submenu */}
              {link.isSubMenu && subMenu && (
                <div className='flex flex-col gap-6 pt-4'>
                  {link.sublinks.map((sublink) => (
                    <Link
                      key={sublink.title}
                      href={sublink.href}
                      onClick={() => setOpen(false)}
                      className={`text-black font-medium text-base leading-[18.32px] font-gt-walsheim text-start ${
                        hash === sublink.href.split("#")[1] ? "text-orange-custom-100 font-bold" : "text-black"
                      }`}
                    >
                      {sublink.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Navbar;
