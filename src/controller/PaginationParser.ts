import { ParsedUrlQuery } from "querystring";

export interface Pagination {
  page: number,
  contentsPerPage: number,
}

export default function ParsePagination(query: ParsedUrlQuery): Pagination {
  let output: Pagination = {
    page: 1,
    contentsPerPage: 20,
  }

  if(query?.page && !Array.isArray(query.page)) {
    output.page = parseInt(query.page)
  }

  if(query?.contentsPerPage && !Array.isArray(query.contentsPerPage)) {
    output.contentsPerPage = parseInt(query.contentsPerPage)
  }

  return output;
}