import ShowNotification from "@/controller/NotificationController"
import { Query } from "@/database/query"
import axios, { Axios } from "axios"

// interface Request {
//   method: string,
//   headers: HeadersInit,
//   body?: BodyInit
// }

export interface APIResponse {
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
        success: result.data != null
      }
    }

    return {
      endpoint, execute
    } 
  })()

  const GeoLocation = {
    getLocation: async function(longitude: number, latitude: number): Promise<APIResponse> {
      const endpoint = `http://api.geonames.org/countryCodeJSON?lat=${latitude}&lng=${longitude}&username=dnj_isme`;
      try {
        const response = await axios.get(endpoint)
        return {
          data: response.data,
          status: response.status,
          raw: response,
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
    }
  }

  const Rest = (function() {
    const endpoint = "http://localhost:8080/api"
    async function fetchData(path: string, method: "GET" | "POST" | "PATCH" | "DELETE", body?: object, auth?: string): Promise<APIResponse> {
      if(!path.startsWith("/")) path = `/${path}`
      if(auth == undefined) auth = ""

      const url = endpoint + path;    

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
    Graphql, Rest, GeoLocation
  }
})()