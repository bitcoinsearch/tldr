import React from "react";
import { getAllNewsletters } from "@/helpers/fs-functions";
import HeroNewsletterDisplay from "./hero-newsletter-display";

const HeroSection = () => {
  const allNewsletters = getAllNewsletters();
  const latestNewsletter = allNewsletters[allNewsletters.length - 1];

  return <HeroNewsletterDisplay latestNewsletter={latestNewsletter} />;
};

export default HeroSection;
