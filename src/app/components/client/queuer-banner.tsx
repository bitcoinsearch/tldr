"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";

const BANNER_KEY = "queuer-banner";

const QueuerBanner = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setCookie(BANNER_KEY, "hidden");
    setIsOpen(false);
  };

  useEffect(() => {
    const banner_in_session = getCookie(BANNER_KEY);
    if (banner_in_session === "hidden") {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;
  return (
    <div className='bg-orange-100 flex items-center w-full sticky top-[40px] md:top-20 -translate-y-[40px] md:-translate-y-20 z-[99]'>
      <div className='flex grow items-center text-sm md:text-base justify-between px-2 md:px-4'>
        <div className='text-gray-600 flex-[1_1_100%] font-medium text-center'>
          <Link href='https://learning.chaincode.com/#FOSS' target='_blank'>
            <span>{`Start Your Career in Bitcoin Open Source`}</span>
            <br />
            <span>{`Development with Chaincode Labs `}</span>
            <span
              style={{
                fontWeight: "medium",
                textTransform: "uppercase",
                color: "#ED8936",
                textDecoration: "underline",
              }}
            >{`Apply Today!`}</span>
          </Link>
        </div>
        <button onClick={handleClose} className='relative h-[18px] w-[18px] grid place-items-center rounded-full hover:bg-orange-300'>
          <Image src='/close_icon.svg' width={10} height={10} alt='close' />
        </button>
      </div>
    </div>
  );
};

export default QueuerBanner;
