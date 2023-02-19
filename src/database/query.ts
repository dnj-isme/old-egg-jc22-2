// import { AxiosResponse } from "axios";

/**
 * Lists the available query to be called to database
 */

export interface Query {
  query: string,
  functionName: string
}

export const SampleQuery = (function (){
  const test:Query = {
    functionName: "experimental",
    query: `
      query getAll {
        experimental {
          id,
          message,
          account {
            id,
            first_name,
            last_name
          }
        }
      }
    `
  }

  return {
    test
  }
})()