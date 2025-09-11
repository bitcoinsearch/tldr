"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function NewsletterNavigation() {
  const router = useRouter();

  return (
    <div className='pt-5 md:pt-[54px]'>
      <button
        onClick={() => router.push("/newsletters")}
        className='flex items-center gap-2 py-2 px-4 md:px-6 rounded-full border border-black w-fit cursor-pointer'
      >
        <ArrowLeftIcon className='w-5 h-5 md:w-6 md:h-6' strokeWidth={4} />
        <span className='text-sm md:text-base font-medium md:font-normal font-gt-walsheim leading-[18.32px]'>Back to Newsletters</span>
      </button>
    </div>
  );
}
