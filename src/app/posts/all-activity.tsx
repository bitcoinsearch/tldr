"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PostsCard } from "../components/client/post-card";
import { HomepageEntryData, SortKey } from "@/helpers/types";
import { getSortedPosts } from "@/helpers/utils";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import dayjs from "dayjs";
import { DateRange } from "react-date-range";
import CategoriesNavigation from "../components/client/categories-navigation";

const AllActivity = ({
  posts,
}: {
  posts: (HomepageEntryData & {
    firstPostDate: string;
    lastPostDate: string;
  })[],
  dev?:string,
},

) => {
  const [sortKey, setSortKey] = useState<SortKey>("all");
  const [openSortDialog] = useState<boolean>(false);

  const memoizedPosts = React.useMemo(
    () => getSortedPosts(posts, sortKey),
    [posts, sortKey]
  );

  return (
    <div className="flex flex-col gap-6 max-w-[866px] mx-auto ">
      <section className="text-base font-gt-walsheim leading-[22.56px] flex items-center gap-4 justify-between">
        <CategoriesNavigation sortKey={sortKey} setSortKey={setSortKey} />
        <section className="flex gap-2">
          <div className="flex items-center gap-4 relative">
            {openSortDialog && (
              <section className="flex flex-col gap-3 bg-white p-6 rounded absolute top-10 right-0 shadow-sm border border-gray-custom-200">
                <p className="text-base leading-[22.56px]">Sort by</p>
                <section className="flex items-center gap-4">
                  <button
                    className={`px-4 py-1 rounded-full text-sm text-nowrap leading-[19.74px]  ${
                      sortKey === "newest"
                        ? "bg-orange-custom-100 text-white"
                        : "bg-gray-custom-1000 text-black"
                    }`}
                    onClick={() => setSortKey("newest")}
                  >
                    Newest First
                  </button>
                  <button
                    className={`px-4 py-1 rounded-full text-sm text-nowrap leading-[19.74px]  ${
                      sortKey === "oldest"
                        ? "bg-orange-custom-100 text-white"
                        : "bg-gray-custom-1000 text-black"
                    }`}
                    onClick={() => setSortKey("oldest")}
                  >
                    Oldest First
                  </button>
                </section>
              </section>
            )}
          </div>
        </section>
      </section>

      <div className="flex items-center justify-between max-w-[866px] mx-auto w-full h-full">
        <section className="flex flex-col gap-4 md:gap-6 pb-[44px]">
          {!memoizedPosts.length ? (
            <p>
              Oops! No ongoing discussions this week. Check out the new posts
              above.
            </p>
          ) : (
            memoizedPosts.map((entry, index) => {
              return <PostsCard entry={entry} key={`${entry.id}-${index}`} />;
            })
          )}
        </section>
      </div>
    </div>
  );
};

export default AllActivity;

const DateRangeDialog = ({
  date,
  setDate,
  className,
  clearDates,
  setClearDates,
  ...props
}: {
  date: {
    startDate?: Date;
    endDate?: Date;
    key: string;
  };
  setDate: React.Dispatch<
    React.SetStateAction<{
      selection: {
        startDate?: Date;
        endDate?: Date;
        key: string;
      };
    }>
  >;
  className?: string;
  clearDates: {
    clear: boolean;
    startDate: Date;
  };
  setClearDates: React.Dispatch<
    React.SetStateAction<{
      clear: boolean;
      startDate: Date;
    }>
  >;
  props?: any;
}) => {
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  return (
    <div className={`text-secondary-black ${className}`}>
      <DateRange
        onChange={(item) => {
          setDate({
            selection: {
              startDate: item.selection.startDate || new Date(),
              endDate: item.selection.endDate || new Date(),
              key: "selection",
            },
          });
        }}
        showPreview={true}
        months={isMobile ? 1 : 2}
        // min date should be Feb 1st of 2024 (beta launch date)
        minDate={dayjs().year(2024).startOf("year").add(1, "month").toDate()}
        maxDate={new Date()}
        direction={isMobile ? "vertical" : "horizontal"}
        rangeColors={["#F7931A"]}
        ranges={[date]}
      />
    </div>
  );
};
