import { getSummaryData } from "@/helpers/fs-functions";
import { convertMailingListUrlToPath } from "@/helpers/redirect-search";
import { stringToHex } from "@/helpers/utils";
import { redirect } from "next/navigation";
import React from "react";

const RedirectPage = async ({ params }: { params: { path: string[] } }) => {
  const [combinedPath, replyPath] = convertMailingListUrlToPath(
    params.path.join("/")
  );

  if (combinedPath) {
    return redirect(`/posts/${combinedPath}-${replyPath}/`);
  }
  return <div>Redirecting,</div>;
};

export default RedirectPage;
