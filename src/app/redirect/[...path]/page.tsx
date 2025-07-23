import { convertMailingListUrlToPath } from "@/helpers/redirect-search";
import { redirect } from "next/navigation";
import React from "react";

const RedirectPage = async ({ params }: { params: { path: string[] } }) => {
  const [combinedPath, replyPath] = await convertMailingListUrlToPath(
    params.path.join("/")
  );

  if (combinedPath) {
    return redirect(`/posts/${combinedPath}-${replyPath}/`);
  } else if (replyPath) {
    return redirect(`/posts/${replyPath}-${replyPath}/`);
  }
  return <div>Redirecting...</div>;
};

export default RedirectPage;
