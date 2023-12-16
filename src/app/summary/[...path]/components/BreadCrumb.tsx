"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CaretRightIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import { SummaryData } from "@/helpers/types";

const BreadCrumbs = ({ params, summaryData, replies }: { params: { path: string[] }; summaryData: SummaryData; replies: string }) => {
  const Router = useRouter();
  const pathname = usePathname();
  const type = params.path[0];

  const [activePath, setActivePath] = useState<{ [key: string]: boolean }>({ ["title"]: false, ["reply"]: false });
  const [routePath, setRoutePath] = useState(pathname);
  const { authors } = summaryData.data;

  useEffect(() => {
    const evaluatePath = () => {
      const splitPath = pathname?.split("/");
      const lastItem = splitPath?.[splitPath?.length - 1];

      const modifiedPath = `${splitPath?.slice(0, splitPath.length - 1).join("/")}/combined_${lastItem?.split("_")[1]}`;

      if (!lastItem?.startsWith("combined")) {
        setRoutePath(modifiedPath);
      }

      if (lastItem?.startsWith("combined")) {
        setActivePath((prev) => ({ ...prev, ["title"]: true }));
      } else {
        setActivePath((prev) => ({ ...prev, ["reply"]: true }));
      }
    };

    evaluatePath();
  }, [Router, pathname]);

  return (
    <section className='flex gap-2 items-center flex-wrap'>
      <div className='flex items-center gap-3'>
        <Image src={`/icons/${type}_icon.svg`} width={18} height={18} alt='' />
        <p className='font-semibold font-inter text-[12.5px] whitespace-nowrap'>{type}</p>
      </div>
      {Number(replies) === 1 ? null : (
        <>
          <CaretRightIcon />
          <Link
            className={`font-semibold font-inter text-[12.5px] whitespace-nowrap break-words ${
              activePath["title"] ? "text-brand-secondary underline" : " text-brand-secondary underline"
            }`}
            href={{ pathname: routePath, query: { replies } }}
          >
            {summaryData.data.title}
          </Link>
        </>
      )}

      {activePath["reply"] && Number(replies) > 1 ? (
        <>
          <CaretRightIcon />
          <section className='flex items-center gap-1'>
            <span className='text-black no-underline font-semibold font-inter text-[12.5px]'>Reply: </span>
            <Link
              className={`font-semibold font-inter text-[12.5px] whitespace-nowrap ${
                activePath["reply"] ? " text-brand-secondary underline" : "text-black no-underline"
              }`}
              href={""}
            >
              {authors.length === 1 ? authors[0].name : null}
            </Link>
          </section>
        </>
      ) : null}
    </section>
  );
};

export default BreadCrumbs;
