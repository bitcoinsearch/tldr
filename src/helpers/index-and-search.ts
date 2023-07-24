import { indexAndSearch } from "./search-data";

const directory = "public/static/static/";
const query = { author: "legal defense", keyword: "Jeremy" };

indexAndSearch(directory, query)
  .then(() => {
    console.log("Index and search completed.");
  })
  .catch((err: any) => {
    console.error("Index and search failed:", err);
  });
