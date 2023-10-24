import { compare, hash } from "bcrypt";

export async function encryptPassword(password: string) {
    const hashedPassword = await hash(password, 8)
    return hashedPassword
}

export async function decryptPassword(payload: string, password: string) {
    const unhashedPassword = await compare(payload, password)
    return unhashedPassword
}