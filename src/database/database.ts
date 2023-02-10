import { Account } from "@/model/Account";
import { Query } from "./query";
// import cors from "cors"

export const Database = (function() {
  const endpoint = "http://localhost:8080/query"
  
  async function execute(operationName: string, query: string, variables: {}) {
    const headers = {
      "content-type": "application/json",
    };
    const graphqlQuery = { operationName, query, variables };

    const options = {
      "method": "POST",
      "headers": headers,
      "body": JSON.stringify(graphqlQuery)
    };

    const response = await fetch(endpoint, options);
    const data = (await response.json()).data[operationName]
    const output = {
      data,
      isEmpty: Object.values(data).every(x => x === null || x === '' || !x)
    }
    return output
  }

  async function signIn(email: string, password: string) : Promise<Account | undefined> {
    
    const res = await execute("attemptLogin", Query.login_example, {email, password});
    if(res.isEmpty) return undefined
    
    return res.data
  }

  return {
    signIn
  }
})()
