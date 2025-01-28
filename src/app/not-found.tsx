"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Wrapper from "./components/server/wrapper";
import { ArrowLinkRight } from "@bitcoin-dev-project/bdp-ui/icons";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <Wrapper>
      <div className='h-[calc(100vh-81px)] flex flex-col'>
        <Link
          href='/'
          className='flex text-sm md:text-base items-center gap-2 font-gt-walsheim border border-black rounded-full px-4 py-2 w-fit mt-6 md:mt-10'
        >
          <ArrowLinkRight className='text-black w-5 md:w-6 rotate-180' />
          Return Home
        </Link>

        <div className='flex items-center justify-center h-full'>
          <div className='flex flex-col items-center justify-center gap-6 max-h-[663px] sm:w-full h-full'>
            <Image
              src='/images/not-found-image.png'
              alt='not found image'
              height={663}
              width={562}
              className='h-[276px] md:h-[663px] w-[326px] md:w-[562px]'
              priority
            />

            <section className='flex flex-col gap-4 md:gap-6 w-full items-center justify-center'>
              <p className='text-2xl sm:text-[32px] lg:text-[48px] leading-[62.06px] font-test-signifier text-nowrap'>Page Not Found!</p>
              <button
                onClick={() => router.back()}
                className='flex items-center justify-center gap-2 py-4 md:py-6 bg-orange-custom-100 rounded-full max-w-[126px] md:max-w-[214px] w-full text-white text-nowrap'
              >
                <ArrowLinkRight className='text-white w-5 md:w-6 rotate-180' />
                Go Back
              </button>
            </section>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
