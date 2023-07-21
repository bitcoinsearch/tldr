import { convertXmlToText, fetchGithub } from "@/helpers/github";
import * as fs from "fs"
import FakeData from "../../data.json"
import Image from "next/image";
import Homepage from "@/components/client/homepage";

export type FakeDataType = typeof FakeData

export default async function Home() {

  const data = FakeData

  return (
    <Homepage data={data} />
  );
}
