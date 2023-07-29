import Homepage from "@/app/components/client/homepage";
import { HomepageData } from "@/helpers/types";
import * as fs from "fs";

async function getHomepageData() {
  try {
    const data = fs.readFileSync(
      `${process.cwd()}/public/static/static/homepage.json`,
      "utf-8"
    );
    const parsedData = JSON.parse(data) as HomepageData;
    return parsedData;
  } catch (err) {
    return null;
  }
}

export default async function Home() {
  const data = await getHomepageData();
  if (!data) return null;

  return <Homepage data={data} />;
}
