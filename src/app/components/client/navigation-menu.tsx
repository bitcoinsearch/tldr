"use client";

import React from "react";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const Menu = () => {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(!open);

  const LinkComponent = ({ title, href, target }: { title: string; href: string; target?: React.HTMLAttributeAnchorTarget }) => {
    return (
      <>
        <Link href={href} onClick={toggle} target={target} className='text-sm hover:bg-[#efefef] cursor-pointer p-[10px] rounded-md'>
          {title}
        </Link>
      </>
    );
  };

  return (
    <div className='flex h-fit overflow-hidden'>
      <button>
        <HamburgerMenuIcon color='black' cursor='pointer' className='hamburgerIcon' onClick={toggle} />
      </button>
      {open ? (
        <>
          <div className='fixed top-0 right-0 left-0 bottom-0 bg-slate-300 h-full opacity-50 overflow-hidden' onClick={toggle}></div>
          <div className='max-w-[250px] md:max-w-[300px] w-full bg-white h-full fixed top-0 right-0 border rounded-l-lg opacity-100 z-50 p-4 transition delay-500 ease-in-out overflow-hidden'>
            <section className='flex justify-end items-end p-[10px] pb-0'>
              <button className='self-end'>
                <Cross2Icon cursor='pointer' className='h-6 w-6 p-1 bg-[#eeeeee] rounded' onClick={toggle} />
              </button>
            </section>
            <section className='flex flex-col gap-[2px] pt-8'>
              <LinkComponent title='Active Discussions' href='/#active_discussions' />
              {/* <LinkComponent title='Today in Bitcoin/LN History' href='/#today_in_history' /> */}
              <LinkComponent title='All Activity' href='/#all_activity' />
              <LinkComponent title='Newsletter' href='/newsletter' />
              <LinkComponent title='RSS feed' href='/rss.xml' target='_blank' />
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Menu;
