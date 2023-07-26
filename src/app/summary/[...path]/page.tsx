import { convertXmlToText } from "@/helpers/convert-from-xml";
import * as fs from "fs";
import Image from "next/image";
import util from "util";

const readdir = util.promisify(fs.readdir);

export const getSummaryData = async (path: string[]) => {

  const index = path.pop()
  const pathStringNoIndex = path.join("/")
  const dirContent = await readdir(`public/static/static/${pathStringNoIndex}`);
  
  const foundFileName = dirContent.find((filename) => filename.split("_")[0] === index)
  if (foundFileName) {
    try {
      const finalRelativePath = [pathStringNoIndex, foundFileName].join("/")
      const fileContent = fs.readFileSync(`public/static/static/${finalRelativePath}`, "utf-8")
      console.log({fileContent})
      const data = await convertXmlToText(fileContent, finalRelativePath)
      return data
    } catch (err) {
      throw err
    }
  } else {
    return null
  }
}
// async function getDataFromXML(data: any) {
//   const filePath = await getSummaryData()
// }

export default async function Page({ params }: { params: { path: string[] } }) {
  const summaryData = await getSummaryData(params.path)
  if (!summaryData) return <h1>No data found</h1>
  const type = params.path[0]
  const splitSentences = summaryData.data.entry.summary.split(/(?<=[.!?])\s+/)
  const firstSentence = splitSentences[0]
  // splitSentences.shift()
  const newSummary = summaryData.data.entry.summary.replace(firstSentence, "")
  return (
    <main>
      <div className="flex flex-col gap-4 my-10 ">
        <div className='flex items-center gap-3'>
          <Image src={`/icons/${type}_icon.svg`} width={18} height={18} alt=""/>
          <p className="font-semibold font-inter text-[12px]">{type}</p>
        </div>
        <h2 className="font-inika text-4xl">{summaryData.data.title}</h2>
      </div>
      <section className="my-10">
        <p className="text-2xl font-inika my-2">{firstSentence}</p>
        <p>{newSummary}</p>
      </section>
      <div></div>
    </main>
  )
}
