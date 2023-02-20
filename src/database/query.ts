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
  
  const banner:Query = {
    functionName: "banners",
    query: `
      query {
        banners {
          id,
          link,
          src,
          status,
          label
        }
      }
    `
  }

  return {
    test, banner
  }
})()