"use client";

import Link from "next/link";
import { menuApps } from "@/data";
import Image, { StaticImageData } from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { AppsIcon } from "@bitcoin-dev-project/bdp-ui/icons";

const AppMenu = () => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='relative flex flex-col'>
      <button ref={buttonRef} onClick={() => setIsOpen((v) => !v)}>
        <div>
          <div
            className={`flex flex-col rounded-lg border border-orange-custom-100 w-12 h-12 items-center justify-center max-xl:w-9 max-xl:h-9 transition-[background-color] duration-200 ${
              open ? "bg-custom-hover-state shadow-custom-sm" : "bg-custom-background"
            }`}
          >
            <div data-freeze-body={open}>
              <AppsIcon className='text-orange-custom-100 w-[28px]' />
            </div>
          </div>
        </div>
      </button>
      <div className='relative z-10'>
        <div data-is-open={open} ref={popoverRef} className='hidden data-[is-open=true]:block absolute top-0 right-0 mt-3 md:mt-4'>
          <div
            className={`bg-white rounded-2xl border border-gray-custom-600 w-[min(90vw,300px)] md:w-[402px] max-h-[calc(100vh-70px)] md:max-h-[calc(100vh-100px)] overflow-auto`}
          >
            <AppItem {...menuApps[0]} />
            <div className='mx-5 md:mx-7 my-3 md:my-3 border border-gray-custom-300'></div>
            {menuApps.slice(1).map((item) => (
              <AppItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
      <div className={`max-h-screen fixed bg-[#0000007f] top-0 bottom-0 right-0 left-0 ${open ? "flex" : "hidden"}`}></div>
    </div>
  );
};

export const AppItem = ({ href, image, alt, title }: { href: string; image: string | StaticImageData; alt: string; title: string }) => (
  <Link
    href={href}
    className='py-2 md:py-3 px-5 md:px-8 gap-3 md:gap-6 flex items-center hover:bg-orange-custom-600 first-of-type:pt-4 first-of-type:md:pt-6 last-of-type:pb-4 last-of-type:md:pb-6'
    target='_blank'
    rel='noopener noreferrer'
  >
    <Image
      className={`rounded-xl w-11 h-11 lg:w-16 lg:h-16 ${
        alt === "Bitcoin search" || alt === "Bitcoin TLDR" ? "border-[1.5px] border-gray-custom-600" : ""
      }`}
      src={image}
      alt={alt}
      width={88}
      height={88}
    />
    <p className='text-xs md:text-sm xl:text-base 2xl:text-lg text-left font-normal'>{title}</p>
  </Link>
);
export default AppMenu;
