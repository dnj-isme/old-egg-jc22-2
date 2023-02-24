import { Query } from "@/database/query"
import axios, { Axios } from "axios"

// interface Request {
//   method: string,
//   headers: HeadersInit,
//   body?: BodyInit
// }

interface APIResponse {
  raw: any,
  status: number,
  data: any, 
  success: boolean
}

export const From = (function() {
  const Graphql = (function () {
    const endpoint = "http://localhost:8080/gqlgen/query"

    async function execute(query: Query, variables?: object): Promise<APIResponse> {
      if(variables == undefined) variables = {}
      const result = await axios({
        method: "POST",
        url: "http://localhost:8080/gqlgen/query",
        data: {
          query: query.query,
          variables
        }
      })
      
      return {
        raw: result,
        status: result.status,
        data: result.data?.data[query.functionName],
        success: true
      }
    }

    return {
      endpoint, execute
    }
  })()

  const Rest = (function() {
    const endpoint = "http://localhost:8080/api"
    4
    async function fetchData(path: string, method: "GET" | "POST" | "PATCH" | "DELETE", body?: object, auth?: string): Promise<APIResponse> {
      if(!path.startsWith("/")) path = `/${path}`
      if(auth == undefined) auth = ""

      const url = endpoint + path;
      
      // const httpRequest : Request = {
      //   method,
      //   headers: {
      //     Authorization: auth
      //   }
      // }



      if(method == "POST") {
        if(body == undefined) body = {}
      //   httpRequest.body = JSON.stringify(body)
      }

      try {
        const result = await axios({
          url,
          method,
          headers: {
            Authorization: auth
          },
          data: body
        })

        return {
          raw: result,
          status: result.status,
          data: result.data,
          success: true
        }
      } catch(e: any) {
        return {
          raw: e,
          status: e.response.status,
          data: e.response.data.error,
          success: false
        }
      }

      // try {
      //   const res = await fetch(url, httpRequest)
      //   return await res.json()
      // }
      // catch (e) {
      //   console.log(e);
      //   return e;
      // }
    }
    return {
      endpoint, fetchData
    }
  })()

  return {
    Graphql, Rest
  }
})()