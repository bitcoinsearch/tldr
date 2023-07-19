export const providers = {
  github: {
    url: "https://api.github.com/",
    endpoints: {
      repos: (path: string) =>
        `repos/bitcoinsearch/mailing-list-summaries/contents/static/${path}`,
    },
  },
};
