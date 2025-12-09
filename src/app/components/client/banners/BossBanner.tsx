"use client";

import { Banner } from "@bitcoin-dev-project/bdp-ui";
import { usePathname } from "next/navigation";

const BossBanner = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={`w-full bg-white sticky top-0 z-20 ${
        isHomePage ? "block" : "hidden"
      }`}
    >
      <Banner
        headingText="Start your career in bitcoin open source —"
        linkText="APPLY FOR THE ₿OSS CHALLENGE TODAY"
        linkTo="https://bosschallenge.xyz/"
        hasBoss
      />
    </div>
  );
};

export default BossBanner;
