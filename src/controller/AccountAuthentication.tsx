// TODO: Do something here...

import { useRouter } from "next/router";
import { Account, AccountRole, Role } from "../model/Account";

export default function AccountAuthentication({currentAccount, expectedRole, children, ...args }:
  {currentAccount: Account | undefined, expectedRole: AccountRole | undefined, children: JSX.Element}) {

    const router = useRouter()
    if(currentAccount === undefined) {
      if(global.debug) console.warn("User doesn't exists");
      router.push("/")
    }
    else if (expectedRole !== undefined && currentAccount.role === expectedRole) {
      if(global.debug) console.warn({
        msg: "Role doesn't matches the required role",
        expected: expectedRole,
        actual: currentAccount.role
      });
      router.push("/")
    }

    return (
      <div {...args}>
        {children}
      </div>
    )
}