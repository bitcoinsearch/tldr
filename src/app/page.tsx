import FakeData from "../../data.json";
import Homepage from "@/components/client/homepage";

export type FakeDataType = typeof FakeData;

export default async function Home() {
  const data = FakeData;

  return <Homepage data={data} />;
}
