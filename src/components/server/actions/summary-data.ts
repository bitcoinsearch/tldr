// import * as fs from "fs";
// import util from "util";

const baseUrl = "https://lists.linuxfoundation.org/pipermail/"

// const readdir = util.promisify(fs.readdir);

export const getRelativePathFromLink = (link: string) => {
  // remove base url and .html extension
  const relativePath = link.replace(/\.html$/, '').split(baseUrl)[1]

  // separate path into their respective sections
  const [list_type, year_month, index] = relativePath.split("/")
  const [year, month] = year_month.split("-")
  const dirPath = [list_type, `${month}_${year}`].join("/")
  const finalRelativePath = [dirPath, index].join("/")
  return finalRelativePath
  // const dirContent = await readdir(`public/static/static/${dirPath}`);
  
  // const foundFileName = dirContent.find((filename) => filename.split("_")[0] === index)
  // if (foundFileName) {
  //   const finalRelativePath = [dirPath, foundFileName].join("/")
  //   console.log(finalRelativePath)
  //   return finalRelativePath
  // }
}