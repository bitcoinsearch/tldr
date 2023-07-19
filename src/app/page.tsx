import { convertXmlToText, fetchGithub } from "@/helpers/github";

export default async function Home() {
  await fetchGithub()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      tldr mailing list
    </main>
  );
}
