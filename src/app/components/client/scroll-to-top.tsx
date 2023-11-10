"use client";

import React, { useEffect, useState } from "react";

import { ArrowUpIcon } from "@radix-ui/react-icons";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > window.innerHeight * 0.3) { // 30% of the screen height
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 xl:right-[22%] right-5 z-50 p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <ArrowUpIcon stroke="#0F0E17" />
    </button>
  );
};

export default ScrollToTopButton;
