import { BITCOINDEV, LIGHTNINGDEV, urlMapping } from "@/config/config";
import type { SearchQuery } from "./types";

const FIELDS_TO_SEARCH = ["authors", "title", "body"];

type BuildQueryForElaSticClient = Omit<SearchQuery, "page"> & {
  from: number;
};

export const buildQuery = ({
  queryString,
  size,
  from,
  sortFields,
  mailListType,
}: BuildQueryForElaSticClient) => {
  const baseQuery = {
    query: {
      bool: {
        must: [] as any[],
        should: [] as any[],
        filter: [
          {
            terms: {
              "domain.keyword": [
                urlMapping["bitcoin-dev"],
                urlMapping["lightning-dev"],
              ],
            },
          },
        ] as any[],
      },
    },
    sort: [] as any[],
    aggs: {
      authors: {
        terms: {
          field: "authors.keyword",
          size: 15,
        },
      },
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
    baseQuery.query.bool.filter[0].terms["domain.keyword"] =
      urlMapping[mailListType];
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
