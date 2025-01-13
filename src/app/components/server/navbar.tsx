"use client";

import Link from "next/link";
import Image from "next/image";
import Wrapper from "./wrapper";
import { usePathname, useRouter } from "next/navigation";
import TanstackProvider from "@/app/provider";
import SearchBox from "../client/search-modal";
import AppMenu from "../client/navigation-menu";
import React, { SetStateAction, useState } from "react";
import { CaretDownIcon, CaretUpIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { MobileNavLinks } from "@/data";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [subMenu, setSubMenu] = useState<{ [key: string]: boolean }>({ "0": false, "1": false, "2": false });
  const pathname = usePathname();
  const hash = typeof window !== "undefined" && window.location.hash ? window.location.hash.replace("#", "") : "";
  const currentPath = pathname && pathname.split("/")[1];

  const handleClick = (href: string, isSubMenu: boolean, index: string) => {
    if (isSubMenu) {
      setSubMenu((prev) => ({ ...prev, [index]: !prev[index] }));
    } else {
      setSubMenu((prev) => ({ ...prev, [index]: false }));
      router.push(href);
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
  }, [open]);

  return (
    <div className='bg-gray-custom-20 -z-10'>
      <Wrapper className='flex items-center justify-between pt-[30px] md:pt-8 z-50'>
        <Link href='/' className='flex items-center'>
          <Image src='/icons/bitcoin-logo-icon.svg' alt='Bitcoin Logo' width={32} height={32} />
          <p className='text-xl font-medium font-gt-walsheim'>TLDR</p>
        </Link>

        <div className='flex gap-5 lg:gap-10 items-center justify-center font-gt-walsheim font-medium text-base lg:text-lg leading-[20.61px]'>
          <nav className='hidden md:flex items-center gap-5 lg:gap-10'>
            <>
              <MenuGroup
                handleClick={handleClick}
                subMenu={subMenu}
                setSubMenu={setSubMenu}
                setOpen={setOpen}
                hash={hash}
                currentPath={currentPath!}
              />
            </>
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
            <MobileMenu setOpen={setOpen} router={router} hash={hash} currentPath={currentPath!} />
          </div>
        ) : null}
      </Wrapper>
    </div>
  );
};

const MobileMenu = ({
  setOpen,
  router,
  hash,
  currentPath,
}: {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  router: AppRouterInstance;
  hash: string;
  currentPath: string;
}) => {
  const [subMenu, setSubMenu] = useState<{ [key: string]: boolean }>({ "0": false, "1": false, "2": false });

  const handleClick = (href: string, isSubMenu: boolean, index: string) => {
    if (isSubMenu) {
      setSubMenu((prev) => ({ ...prev, [index]: !prev[index] }));
    } else {
      setSubMenu((prev) => ({ ...prev, [index]: false }));
      router.push(href);
      setOpen(false);
    }
  };

  return (
    <div className='flex flex-col gap-6 bg-white min-h-full overflow-y-scroll'>
      <section className='flex-col gap-2'>
        <div className='w-full flex flex-col gap-8'>
          <MenuGroup handleClick={handleClick} subMenu={subMenu} setSubMenu={setSubMenu} setOpen={setOpen} hash={hash} currentPath={currentPath!} />
        </div>
      </section>
    </div>
  );
};

export default Navbar;

const SubmenuGroup = ({
  link,
  index,
  setSubMenu,
  setOpen,
  hash,
}: {
  link: { title: string; href: string; sublinks: { title: string; href: string }[] };
  index: number;
  setSubMenu: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  hash: string;
}) => {
  return (
    <>
      {link.sublinks.map((sublink: { title: string; href: string }) => (
        <Link
          key={sublink.title}
          href={sublink.href}
          onClick={() => {
            setSubMenu((prev) => ({ ...prev, [index]: false }));
            setOpen(false);
          }}
          target={sublink.href.includes(".xml") ? "_blank" : undefined}
          className={`text-black font-medium text-base leading-[18.32px] font-gt-walsheim text-nowrap text-start ${
            hash === sublink.href.split("#")[1] ? "text-orange-custom-100 font-bold" : "text-black"
          }`}
        >
          {sublink.title}
        </Link>
      ))}
    </>
  );
};

const MenuGroup = ({
  handleClick,
  subMenu,
  setSubMenu,
  setOpen,
  hash,
  currentPath,
}: {
  handleClick: (href: string, isSubMenu: boolean, index: string) => void;
  subMenu: { [key: string]: boolean };
  setSubMenu: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  hash: string;
  currentPath: string;
}) => {
  return (
    <>
      {MobileNavLinks.map((link, index) => (
        <div key={link.title} className='md:relative'>
          <button
            key={link.title}
            onClick={() => handleClick(link.href, link.isSubMenu, String(index))}
            className={`text-black font-medium text-lg leading-[20.61px] font-gt-walsheim text-start flex items-center justify-between w-full max-w-[253px] ${
              subMenu[String(index)] ? "text-orange-custom-100 font-bold" : "text-black"
            } ${currentPath === link.href.split("/")[1] ? "text-orange-custom-100 font-bold" : "text-black"}`}
          >
            {link.title}
            {link.isSubMenu && <span>{subMenu[String(index)] ? <CaretUpIcon className='w-5 h-5' /> : <CaretDownIcon className='w-5 h-5' />}</span>}
          </button>

          {/* submenu */}
          <div className='md:absolute md:top-8 md:right-0 md:bg-white md:border md:border-[#EBEBEB] md:rounded-lg'>
            {link.isSubMenu && subMenu[String(index)] && (
              <div className='flex flex-col gap-6 pt-4 md:p-6'>
                <SubmenuGroup link={link} index={index} setSubMenu={setSubMenu} setOpen={setOpen} hash={hash} />
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};
