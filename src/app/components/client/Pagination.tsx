"use client";

import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";

type IPagination = {
  pages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};

const Pagination = ({ pages, currentPage, setCurrentPage }: IPagination) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams!);

  const pageNumber = urlParams.get("page");

  const handleNextPage = (page: number, setCurrentPage: React.Dispatch<React.SetStateAction<number>>) => {
    urlParams.set("page", String(page));
    setCurrentPage(page);
    router.replace(`${pathname}?${urlParams.toString()}`);
  };

  useEffect(() => {
    if (pageNumber) {
      setCurrentPage(Number(pageNumber as string));
    }
  }, [router, setCurrentPage, pageNumber]);

  const pagesToShow = useMemo(() => {
    let pagesArray = [];
    let start, end;

    if (pages === 0) {
      return [];
    }
    // Always show the first page
    pagesArray.push(1);

    // Calculate the dynamic window of pages around the current page
    start = Math.max(2, currentPage - 2);
    const numToUse = currentPage === 1 ? 4 : 2;
    end = Math.min(pages - 1, currentPage + numToUse);

    // Create the range of pages based on the start and end
    for (let i = start; i <= end; i++) {
      pagesArray.push(i);
    }

    // If there are pages left after the current window, show '...' and the last page
    if (end < pages - 1) {
      pagesArray.push("...");
    }
    if (end < pages && pages >= 2) {
      pagesArray.push(pages);
    }

    return pagesArray;
  }, [currentPage, pages]);

  return (
    <>
      <div className='flex justify-center items-center gap-2 max-md:gap-1'>
        {currentPage > 1 && (
          <button
            onClick={() => handleNextPage(currentPage - 1, setCurrentPage)}
            className='border border-gray-custom-600 md:border-none rounded-lg h-[53px] w-[53px] max-md:h-8 max-md:w-8 flex items-center justify-center'
            aria-label='Previous Page'
          >
            <CaretLeftIcon className='w-5 h-5 md:w-6 md:h-6' strokeWidth={4} />
          </button>
        )}

        {pagesToShow.map((item, index) => {
          if (item === "...") {
            return (
              <span key={index} className='font-semibold'>
                ...
              </span>
            );
          }
          return (
            <button
              onClick={() => handleNextPage(Number(item), setCurrentPage)}
              key={Number(item) * Math.random() * 3.142}
              className={`rounded-md h-[53px] w-[53px] max-md:h-8 max-md:w-8 cursor-pointer ${
                currentPage === item
                  ? "font-bold bg-orange-custom-100 text-white cursor-none"
                  : "font-normal bg-transparent hover:border hover:border-orange-custom-100 cursor-pointer border border-gray-custom-600 md:border-none"
              }`}
            >
              {item}
            </button>
          );
        })}

        {currentPage < pages && (
          <button
            onClick={() => handleNextPage(currentPage + 1, setCurrentPage)}
            className='flex items-center justify-center rounded-lg h-[53px] w-[53px] max-md:h-8 max-md:w-8 hover:border hover:border-orange-custom-100 border border-gray-custom-600 md:border-none'
            aria-label='Next Page'
          >
            <CaretRightIcon className='w-5 h-5 md:w-6 md:h-6' strokeWidth={4} />
          </button>
        )}
      </div>
    </>
  );
};

export default Pagination;
