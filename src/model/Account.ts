export interface Account {
    id: string,
    first_name: string,
    last_name: string,
    role: AccountRole,
    email: string,
    phone?: string,
    password: string,
    subscribe: boolean,
}

export const Role = (function() {
    const Administrator : AccountRole = "admin"
    const User : AccountRole = "user"

    return {
        Administrator, User
    }
})()

export type AccountRole = "admin" | "user"
