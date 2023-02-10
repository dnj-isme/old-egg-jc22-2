import { Database } from '@/database/database'
import { Query } from '@/database/query'
import axios from 'axios'
import { FormEvent, FormEventHandler, useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()

  function handleSignin(e: FormEvent) {
    e.preventDefault()
    if(email != undefined && password != undefined) {
      attemptSignin(email, password)
    }
  }

  async function attemptSignin(email: string, password: string) {
    const account = await Database.signIn(email, password)
    if(account !== undefined) {
      alert("Welcome " + account.first_name)
    }
    else {
      alert("Invalid username or password")
    }
  }

  return (
    <>
      <form method='post' onSubmit={handleSignin}>
        <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} />
        <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Sign In</button>
      </form>
    </>
  )
}