import { getRelativePathFromInternalLink } from "@/components/server/actions/summary-data";
import { convertXmlToText } from "@/helpers/convert-from-xml";
import { AuthorData } from "@/helpers/types";
import * as fs from "fs";
import Image from "next/image";
import Link from "next/link";
// import util from "util";

// const readdir = util.promisify(fs.readdir);

const getSummaryData = async (path: string[]) => {
  const index = path.pop();
  const pathStringNoIndex = path.join("/");
  const dirContent = fs.readdirSync(`public/static/static/${pathStringNoIndex}`)
  // const dirContent = await readdir(`public/static/static/${pathStringNoIndex}`);

  const foundFileName = dirContent.find(
    (filename) => filename.split("_")[0] === index
  );
  if (foundFileName) {
    try {
      const finalRelativePath = [pathStringNoIndex, foundFileName].join("/");
      const fileContent = fs.readFileSync(
        `public/static/static/${finalRelativePath}`,
        "utf-8"
      );
      const data = await convertXmlToText(fileContent, finalRelativePath);
      return data;
    } catch (err) {
      throw err;
    }
  } else {
    return null;
  }
};

export default async function Page({ params }: { params: { path: string[] } }) {
  const summaryData = await getSummaryData(params.path);
  if (!summaryData) return <h1>No data found</h1>;
  const type = params.path[0];
  const splitSentences = summaryData.data.entry.summary.split(/(?<=[.!?])\s+/);
  const firstSentence = splitSentences[0];
  const newSummary = summaryData.data.entry.summary.replace(firstSentence, "");
  const { authors, historyLinks } = summaryData.data;

  return (
    <main>
      <div className="flex flex-col gap-4 my-10 ">
        <div className="flex items-center gap-3">
          <Image
            src={`/icons/${type}_icon.svg`}
            width={18}
            height={18}
            alt=""
          />
          <p className="font-semibold font-inter text-[12px]">{type}</p>
        </div>
        <h2 className="font-inika text-4xl">{summaryData.data.title}</h2>
      </div>
      <section className="my-10">
        <p className="text-2xl font-inika my-2">{firstSentence}</p>
        <p>{newSummary}</p>
      </section>
      {historyLinks && historyLinks?.length > 0 ? (
        <div>
          <p>Discussion History</p>
          <div className="mt-6">
            {historyLinks.map((link, index) => {
              return (
                <SingleHistoryThread key={index} index={index} historyLink={link} author={authors[index]} length={historyLinks.length} />
              );
            })}
          </div>
        </div>
      ) : null}
    </main>
  );
}

const SingleHistoryThread = ({
  historyLink,
  author,
  index,
  length,
}: {
  historyLink: string;
  author: AuthorData;
  index: number;
  length: number
}) => {
  const path = getRelativePathFromInternalLink(historyLink)
  return (
    <div key={index} className="flex relative pb-8 gap-4">
      {length-1 !== index && <div className="absolute bg-gray-200 left-4 -translate-x-1/2 z-[-1] top-0 w-1 h-full"></div>}
      <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
        <span>{index}</span>
      </div>
      <div>
        <div className="flex gap-2">
          <Link href={path}>
            <span className="pb-[2px] border-b-2 border-brand-secondary leading-relaxed text-brand-secondary font-semibold">
              {author.name}
            </span>
          </Link>
          {index === 0 && (
            <span className="py-1 px-1 font-inika text-sm bg-yellow-100 text-gray-900">
              Original Post
            </span>
          )}
        </div>
        <div className="py-2">{author.date}</div>
      </div>
    </div>
  );
};
