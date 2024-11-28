"use client";

import { Banner } from "@bitcoin-dev-project/bdp-ui";
import { usePathname } from "next/navigation";

const BossBanner = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={`w-full bg-white sticky top-0 z-[100] ${
        isHomePage ? "block" : "hidden"
      }`}
    >
      <Banner
        headingText="Start your career in bitcoin open source —"
        linkText="APPLY TODAY"
        linkTo="https://learning.chaincode.com/#BOSS"
        hasBoss
      />
    </div>
  );
};

export default BossBanner;
