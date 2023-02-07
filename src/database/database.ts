import axios from "axios";
import { Query } from "./query";
// import cors from "cors"

export const Database = (function() {
  const endpoint = "http://localhost:8080/query"

  async function execute(query: string, variables: {}) {
    
    const headers = {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
      'Access-Control-Allow-Credentials': 'true',
      "Access-Control-Allow-Methods": "GET,POST",
    }
    const data = {
      query,
      variables
    }

    const result = await axios.post(endpoint, data, {headers});
    
    return {
      raw_result: result,
      data: result.data.data
    }
  }
  
  return {
    execute
  }
})()
