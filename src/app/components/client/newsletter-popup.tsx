"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import MailchimpSubscribeForm from "./subscribe-to-newsletter";

const NewsletterPopup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalOpen]);

  const Modal = () => {
    if (typeof window === "undefined") return null;

    return ReactDOM.createPortal(
      <div className='fixed inset-0 z-50 flex items-center justify-center px-3'>
        <div className='absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300' onClick={() => setIsModalOpen(false)}></div>

        <div className='bg-white shadow-lg z-10 w-fit md:w-full max-w-[380px] md:max-w-[1090px] md:h-[392px] rounded-[48px] md:rounded-[130px] transform transition-transform duration-300 ease-in-out flex flex-col md:flex-row items-center p-4 md:p-0'>
          <div className='max-w-fit md:max-w-[41%] w-full bg-gray-custom-700 h-full rounded-full md:rounded-r-none md:rounded-l-[130px] flex items-center justify-center p-6'>
            <button className='self-end md:hidden absolute top-6 right-6' onClick={() => setIsModalOpen(false)}>
              <Image src='/icons/close-icon.svg' alt='close icon' width={24} height={24} />
            </button>

            <section className='relative w-[114px] h-[114px] md:w-[298px] md:h-[298px]'>
              <Image src='/icons/newsletter-modal-icon.svg' alt='newsletter modal icon' layout='fill' objectFit='contain' />
            </section>
          </div>

          <div className='flex flex-col items-center w-full max-w-[480px] md:max-w-[535px] pb-3 pt-4 md:p-6'>
            <button className='pb-6 self-end hidden md:block' onClick={() => setIsModalOpen(false)}>
              <Image src='/icons/close-icon.svg' alt='close icon' width={24} height={24} />
            </button>

            <section className='flex flex-col gap-4 max-w-[480px] md:max-w-[535px]'>
              <section className='flex flex-col gap-2'>
                <h4 className='text-2xl leading-9 md:leading-[36px] font-medium font-test-signifier text-center md:text-start'>
                  Join Our Newsletter
                </h4>
                <p className='text-sm md:text-base font-gt-walsheim font-normal text-center md:text-start'>
                  We’ll email you summaries of the latest discussions from authoritative bitcoin sources, like bitcoin-dev, lightning-dev, and Delving
                  Bitcoin.
                </p>
              </section>
              <MailchimpSubscribeForm />
            </section>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <main className='relative'>
      <div className='p-4 md:p-6 bg-orange-custom-200 rounded-lg border-l-2 border-l-orange-custom-100'>
        <section className='max-w-[709px] flex flex-col gap-4 md:gap-8'>
          <p className='text-sm md:text-lg font-gt-walsheim leading-6 md:leading-8 italic font-light'>
            Our weekly newsletter is focused on keeping you updated on what&apos;s new in Bitcoin, and summarizes the{" "}
            <span className='underline'>bitcoin-dev</span>, <span className='underline'>lightning-dev</span> and{" "}
            <span className='underline'>delving bitcoin</span> mailing lists
          </p>

          <button
            className='font-test-signifier text-sm md:text-base leading-6 py-4 px-[30.5px] md:px-[50px] rounded-full bg-black text-white text-center w-fit text-nowrap'
            onClick={() => setIsModalOpen(true)}
          >
            Subscribe to our newsletter
          </button>
        </section>
      </div>

      {isModalOpen && <Modal />}
    </main>
  );
};

export default NewsletterPopup;
