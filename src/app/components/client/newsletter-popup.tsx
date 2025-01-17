"use client";

import React, { useState } from "react";

const NewsletterPopup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='p-6 bg-orange-custom-200 rounded-lg border-l-2 border-l-orange-custom-100'>
      <section className='max-w-[709px] flex flex-col gap-8'>
        <p className='text-lg font-gt-walsheim leading-8 italic font-light'>
          Our weekly newsletter is focused on keeping you updated on what’s new in Bitcoin, and summarizes the{" "}
          <span className='underline'>bitcoin-dev</span>, <span className='underline'>lightning-dev</span> and{" "}
          <span className='underline'>delving bitcoin</span> mailing lists
        </p>

        <button className='font-test-signifier text-sm lg:text-base leading-6 py-4 px-[50px] rounded-full bg-black text-white text-center w-fit'>
          Subscribe to our newsletter
        </button>
      </section>
    </div>
  );
};

export default NewsletterPopup;
