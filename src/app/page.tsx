import { convertXmlToText } from "@/helpers/github";

export default async function Home() {
  const d = await convertXmlToText()
  console.log({d});
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      tldr mailing list
    </main>
  );
}
