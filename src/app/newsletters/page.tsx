import Wrapper from "../components/server/wrapper";
import { getAllNewsletters } from "@/helpers/fs-functions";
import NewsletterPageClient from "./newletter-page-client";

export default function Page() {
  const getNewsletters = getAllNewsletters();
  if (!getNewsletters) return null;

  const allNewsletters = getNewsletters?.reverse();

  return (
    <Wrapper>
      <NewsletterPageClient newsletters={allNewsletters} />
    </Wrapper>
  );
}
