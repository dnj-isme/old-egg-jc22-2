import { AxiosResponse } from "axios";

/**
 * Lists the available query to be called to database
 */
export const Query = (function (){
  const login_example = `
  query attemptLogin($email: String!, $password:String!){
    attemptLogin(input: {
      email: $email
      password: $password
    })
    {
      id,
      first_name,
      last_name,
      email,
      password,
      phone,
      subscribe
    }
  }
  `

  return {
    login_example
  }
})()