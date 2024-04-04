import * as fs from "fs";
import { NewsLetterDataType, NewsLetterSet } from "@/helpers/types";
import { NewsletterPage } from "../components/server/newsletter";
import Link from "next/link";
import { formattedDate } from "@/helpers/utils";

// get most recent newsletter from newsletter.json
const getCurrentNewsletter = () => {
  try {
    const data = fs.readFileSync(
      `${process.cwd()}/public/static/static/newsletters/newsletter.json`,
      "utf-8"
    );
    const parsedData = JSON.parse(data) as NewsLetterDataType;
    return parsedData;
  } catch (err) {
    return null;
  }
};

// extract all newsletters
const getAllNewsLetters = () => {
  let all_newsletters: NewsLetterSet[] = [];

  try {
    const dir = `${process.cwd()}/public/static/static/newsletters`;
    const folder = fs.readdirSync(dir);
    const getfolders = folder.slice(0, folder.length - 1);

    // Sort folders by date to arrange them in descending order
    const folderNameToDate = (folderName: string) => {
      const [month, year] = folderName.split("_");
      return new Date(`${month} 1, ${year}`);
    };
    getfolders.sort((a, b) => {
      return Number(folderNameToDate(b)) - Number(folderNameToDate(a));
    });

    // loop through each folder and extract the newsletters
    for (let i = 0; i < getfolders.length; i++) {
      let newsletter_set: {
        title: string;
        link: string;
      }[] = [];
      let newsletter_section: NewsLetterSet = {
        year: "",
        newsletters: [],
      };
      const month_batch = getfolders[i];
      newsletter_section["year"] = month_batch.replace("_", ", ");
      const json_dir = `${dir}/${month_batch}`;
      const json_path = fs.readdirSync(json_dir);

      for (let j = 0; j < json_path.length; j++) {
        const weekly_newsletter = json_path[j];
        const file_path = `month/newsletters/${month_batch}/${weekly_newsletter}`;

        const get_title = formattedDate(new Date(weekly_newsletter.split("-newsletter")[0]).toISOString())
          .split(":")[0]
          .slice(0, -2)
          .trim();

        const existingNewsletter = newsletter_set.find((newsletter) => newsletter.title === get_title && newsletter.link === file_path);
        if (!existingNewsletter) {
          newsletter_set.push({ title: get_title, link: file_path });
        }
      }
      newsletter_section["newsletters"] = newsletter_set;
      all_newsletters.push(newsletter_section);
    }

    return all_newsletters as NewsLetterSet[];
  } catch (err) {
    console.error(err);
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
        <h2 className="text-xl md:text-4xl font-normal pb-8 pt-10">
          Monthly Newsletters{" "}
        </h2>
        <div className="flex flex-col gap-5">
          {newsletter_sets.map((set, index) => (
            <div key={`${index}_${set.year}`}>
              <h2 className='text-lg font-normal pb-2'>{set.year}</h2>

              {set.newsletters.length
                ? set.newsletters.map((newsletter, index) => (
                    <ul className='list-disc pl-4 flex flex-col gap-1' key={`${index}_${newsletter.link}`}>
                      <li>
                        <Link className='text-sm underline cursor-pointer' href={newsletter.link}>
                          {newsletter.title}
                        </Link>
                      </li>
                    </ul>
                  ))
                : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
