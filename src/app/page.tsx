import { fetchGithubData } from "@/helpers/github";

export default async function Home() {
  const data = await fetchGithubData("lightning-dev/April_2016/000507_Acknowledgements-in-BOLT-2.xml");
  console.log(data);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      tldr mailing list
    </main>
  );
}
