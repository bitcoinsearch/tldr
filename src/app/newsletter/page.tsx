import * as fs from "fs";
import { NewsLetterDataType, NewsLetterSet } from "@/helpers/types";
import { NewsletterPage } from "../components/server/newsletter";
import Link from "next/link";

// get most recent newsletter from newsletter.json
const getCurrentNewsletter = () => {
  try {
    const data = fs.readFileSync(`${process.cwd()}/public/static/static/newsletters/newsletter.json`, "utf-8");
    const parsedData = JSON.parse(data) as NewsLetterDataType;
    return parsedData;
  } catch (err) {
    return null;
  }
};

// extract all newsletters
const getAllNewsLetters = () => {
  let newsletter_sets = [];
  let dataObject: any = {};

  try {
    const dir = `${process.cwd()}/public/static/static/newsletters`;
    const folder = fs.readdirSync(dir);
    const getfolders = folder.slice(0, folder.length - 1);

    for (let i = 0; i < getfolders.length; i++) {
      const month_batch = getfolders[i];
      dataObject[`year`] = month_batch.replace("_", " ");
      const json_dir = `${dir}/${month_batch}`;
      const json_path = fs.readdirSync(json_dir);

      for (let j = 0; j < json_path.length; j++) {
        const weekly_newsletter = json_path[j];

        const file_path = `month/newsletters/${month_batch}/${weekly_newsletter}`;
        const data = fs.readFileSync(`${process.cwd()}/public/static/static/newsletters/${month_batch}/${weekly_newsletter}`, "utf-8");

        const parsedData = JSON.parse(data) as NewsLetterDataType;
        const get_title = parsedData.summary_of_threads_started_this_week.split(".")[0];

        dataObject[`week_${j}`] = { title: get_title, link: file_path };
      }
      newsletter_sets.push(dataObject);
    }

    return newsletter_sets as NewsLetterSet[];
  } catch (err) {
    return null;
  }
};

export default async function Page() {
  const newsletters = getCurrentNewsletter();
  const newsletter_sets = getAllNewsLetters();

  if (!newsletter_sets) return null;
  if (!newsletters) return null;

  return (
    <div>
      <NewsletterPage newsletter={newsletters} />
      <section>
        <h2 className='text-xl md:text-4xl font-normal pb-8 pt-10'>Monthly Newsletters </h2>
        <div className='flex flex-col gap-5'>
          {newsletter_sets.map((set, index) => (
            <>
              <div key={`${index}_${set.week_0.link}`}>
                <h2 className='text-lg font-normal pb-2'>{set.year}</h2>

                <ul className='list-disc pl-4 flex flex-col gap-1'>
                  <li>
                    <Link className='text-sm underline cursor-pointer' href={set.week_0.link}>
                      {set.week_0.title}
                    </Link>
                  </li>
                  <li>
                    <Link className='text-sm underline cursor-pointer' href={set.week_1.link}>
                      {set.week_1.title}
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          ))}
        </div>
      </section>
    </div>
  );
}
