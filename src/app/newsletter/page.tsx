import * as fs from "fs";
import { NewsLetter as NewsLetterType, NewsLetterData } from "@/helpers/types";
import { formattedDate } from "@/helpers/utils";
import Link from "next/link";
import { SummaryList } from "../components/server/post";

const getNewsLetterData = async () => {
  "use server";
  try {
    const dir = `${process.cwd()}/public/static/static/newsletters`;
    const folderData = fs.readdirSync(dir);

    const monthlyBatch = [];
    for (let index = 0; index < folderData.length; index++) {
      const element = folderData[index];

      const json_dir = `${dir}/${element}`;
      const json_path = fs.readdirSync(json_dir)[index];
      const data = fs.readFileSync(`${process.cwd()}/public/static/static/newsletters/${element}/${json_path}`, "utf-8");

      const parsedData = JSON.parse(data) as NewsLetterData;
      monthlyBatch.push(parsedData);
    }

    return monthlyBatch;
  } catch (err) {
    return null;
  }
};

export async function NewsLetterPage() {
  const newsletters = await getNewsLetterData();
  if (!newsletters) return null;

  return (
    <div>
      <h2 className='text-xl md:text-4xl font-normal pb-8 pt-10'>Newsletters </h2>
      <div>
        <p className='pb-12'>{newsletters[0].summary_of_threads_started_this_week}</p>
        <section className='flex flex-col gap-9'>
          {newsletters[0].new_threads_this_week.map((entry) => (
            <NewsLetter entry={entry} key={entry.id} />
          ))}
        </section>
      </div>
    </div>
  );
}

export default NewsLetterPage;

export const NewsLetter = ({ entry }: { entry: NewsLetterType }) => {
  const publishedAtDateDisplay = formattedDate(entry.published_at);

  return (
    <div key={`${entry.id}_${entry.title}`} className='flex flex-col gap-2'>
      <p className='text-sm'>{publishedAtDateDisplay}</p>
      <Link href={entry.combined_summ_file_path} className='font-inika text-lg md:text-2xl underline cursor-pointer capitalize pb-3'>
        {entry.title}
      </Link>
      <SummaryList summary={entry.summary} />
    </div>
  );
};
