import axios from "axios";
import { providers } from "./providers";

const baseUrl = providers.github.url;

export const fetchGithubData = async (path: string) => {
  const { data } = await axios.get(
    `${baseUrl}${providers.github.endpoints.repos(path)}`,
    {
      headers: {
        Accept: "application/vnd.github.raw+json",
      },
    }
  );
  return data;
};
