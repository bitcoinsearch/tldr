"use client";

import React from "react";
import Wrapper from "../server/wrapper";
import Link from "next/link";
import Image from "next/image";
import { menuApps } from "@/data";
import { Footer } from "@bitcoin-dev-project/bdp-ui";
import MailchimpSubscribeForm from "./subscribe-to-newsletter";

const CustomFooter = () => {
  return (
    <Wrapper className='py-8 md:py-16 px-4 md:px-8 flex flex-col gap-6 md:gap-10'>
      <div className='flex flex-col gap-6 md:gap-8'>
        <Link href='/' className='flex items-center'>
          <Image src='/icons/bitcoin-logo-icon.svg' alt='Bitcoin Logo' width={32} height={32} />
          <p className='text-xl font-medium font-gt-walsheim'>TLDR</p>
        </Link>

        <section className='flex flex-col gap-4 max-w-[480px] md:max-w-[689px]'>
          <section className='flex flex-col gap-2'>
            <h4 className='text-lg md:text-2xl leading-[27px] md:leading-[36px] font-medium font-test-signifier'>Join Our Newsletter</h4>
            <p className='text-sm md:text-base font-gt-walsheim font-normal'>
              We’ll email you summaries of the latest discussions from high signal bitcoin sources, like bitcoin-dev, lightning-dev, and Delving
              Bitcoin.
            </p>
          </section>
          <MailchimpSubscribeForm className='w-full max-w-[689px]' />
        </section>
      </div>

      <div className='border-b-[0.5px] border-gray-custom-800'></div>

      <div className='flex flex-col gap-4'>
        <h4 className='text-2xl leading-[34px] font-medium font-test-signifier'>Explore all Products</h4>
        <section className='flex gap-6 flex-wrap max-xl:gap-6 max-md:max-w-full max-lg:gap-4'>
          {menuApps.slice(1).map(({ href, image, alt }) => (
            <Link href={href} target='_blank' rel='noopener noreferrer' key={alt}>
              <Image
                className={`rounded-xl w-[54px] h-[54px] md:w-20 md:h-20 border border-gray-custom-200 ${
                  alt === "Bitcoin search" || alt === "Bitcoin TLDR" ? "border border-grey-custom-900" : ""
                }`}
                src={image}
                alt={alt}
                width={88}
                height={88}
              />
            </Link>
          ))}
        </section>
      </div>

      <div className='border-b-[0.5px] border-gray-custom-800'></div>

      <Footer
        className='px-0 bg-white dark:bg-white font-gt-walsheim'
        separator={<div className='h-5 border-r xl:h-6 xl:border-r border-r-black hidden xl:block' />}
      >
        <div className='flex flex-col md:flex-row gap-6 md:gap-[34px] items-start md:items-center'>
          <Footer.Socials
            className='flex items-center gap-5 text-black'
            platforms={[
              {
                entity: "github",
                entityLink: "https://github.com/bitcoinsearch/tldr",
                iconProps: {
                  className: "hover:text-orange-400 text-black",
                },
              },
              {
                entity: "discord",
                entityLink: "https://discord.gg/EAy9XMufbY",
                iconProps: {
                  className: "hover:text-orange-400 text-black",
                },
              },
              {
                entity: "twitter",
                entityLink: "https://x.com/Bitcoin_Devs",
                iconProps: {
                  className: "hover:text-orange-400 text-black",
                },
              },
              {
                entity: "nostr",
                entityLink: "https://njump.me/npub10p33xu03t8q7d9nxtks63dq4gmt4v4d3ppd5lcdp4rg9hxsd0f8q7mn2l2",
                iconProps: {
                  className: "hover:text-orange-400 text-black",
                },
              },
              {
                entity: "linkedin",
                entityLink: "https://www.linkedin.com/company/bitcoin-dev-project/",
                iconProps: {
                  className: "hover:text-orange-400 text-black",
                },
              },
            ]}
          />
          <Footer.About
            entityLink='https://bitcoindevs.xyz'
            entityName='Bitcoin Dev Project'
            className='font-medium text-gray-custom-900 dark:text-gray-custom-900'
          />
        </div>
        <Footer.Public
          dashboardLink='https://visits.bitcoindevs.xyz/share/btDhVSkbULr146OJ/tldr'
          className='font-medium text-gray-custom-900 dark:text-gray-custom-900'
        />

        <div className='flex flex-col md:flex-row gap-6 md:gap-[34px] items-star md:items-center'>
          <p className='font-medium text-gray-custom-900 dark:text-gray-custom-900'>
            <span className='leading-none md:leading-tight flex flex-col sm:flex-row items-stretch sm:items-center text-sm text-gray-custom-900 dark:text-gray-custom-900 gap-[20px] md:gap-[24px]'>
              We&apos;d love to hear your feedback on this project.
            </span>
          </p>
          <Link
            href='https://forms.gle/aLtBMjAeLZiKCFxn8'
            target='_blank'
            className='text-white text-sm leading-[14px] font-gt-walsheim font-medium bg-orange-custom-100 rounded-full px-6 py-4 md:py-5 text-nowrap w-fit self-center'
          >
            Give Feedback
          </Link>
        </div>
      </Footer>
    </Wrapper>
  );
};

export default CustomFooter;
