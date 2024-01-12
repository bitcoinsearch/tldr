import { BITCOINDEV, DELVINGBITCOIN, LIGHTNINGDEV, urlMapping } from "@/config/config";
import type { SearchQuery } from "./types";

const FIELDS_TO_SEARCH = ["authors", "title", "body"];

type BuildQueryForElaSticClient = Omit<SearchQuery, "page"> & {
  from: number;
};

export const buildQuery = ({
  queryString,
  authorString,
  size,
  from,
  sortFields,
  mailListType,
}: BuildQueryForElaSticClient) => {
  const baseQuery = {
    query: {
      bool: {
        must: [
          {
            match: {
              type: "combined-summary",
            },
          },
        ] as any[],
        should: [] as any[],
        filter: [
          {
            terms: {
              "domain.keyword": [
                urlMapping[BITCOINDEV],
                urlMapping[LIGHTNINGDEV],
                urlMapping[DELVINGBITCOIN]
              ],
            },
          },
        ] as any[],
      },
    },
    sort: [] as any[],
    aggs: {
      domains: {
        terms: {
          field: "domain.keyword",
          size: 15,
        },
      },
      tags: {
        terms: {
          field: "tags.keyword",
          size: 15,
        },
      },
    },
    size,
    from,
  };

  //Add the clause to the should array
  let shouldClause = buildShouldQueryClause(queryString);

  baseQuery.query.bool.must.push(shouldClause);

  
  if (mailListType) {
    baseQuery.query.bool.filter[0].terms["domain.keyword"] = [urlMapping[mailListType]]
  }

  if (authorString) {
    baseQuery.query.bool.filter[1] = {
      match: {
        "author_list": authorString
      }
    }
  }

  if (sortFields && sortFields.length) {
    for (let field of sortFields) {
      const sortClause = buildSortClause(field);
      baseQuery.sort.push(sortClause);
    }
  }

  return baseQuery;
};

const buildShouldQueryClause = (queryString: string) => {
  let shouldQueryClause = {
    multi_match: {
      query: queryString,
      fields: FIELDS_TO_SEARCH,
    },
  };

  return shouldQueryClause;
};

const buildSortClause = ({ field, value }: { field: any; value: any }) => {
  return {
    [field]: value,
  };
};
