import React from "react";
import * as fs from "fs";
import { NewsletterPage } from "../../components/server/newsletter";
import { NewsLetterDataType } from "@/helpers/types";

const monthlyNewsletter = async (path: string[]) => {
  const pathString = path.join("/").replace("month/", "/");

  try {
    const data = fs.readFileSync(`${process.cwd()}/public/static/static/${pathString}`, "utf-8");
    const parsedData = JSON.parse(data) as NewsLetterDataType;
    return parsedData;
  } catch (err) {
    return null;
  }
};

export default async function Page({ params }: { params: { path: string[] } }) {

  const data = await monthlyNewsletter(params.path);
  if (!data) return <h1>No Data found</h1>;

  return (
    <div>
      <NewsletterPage newsletter={data} />
    </div>
  );
}
