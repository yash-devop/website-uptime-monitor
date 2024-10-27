import { sign } from "jsonwebtoken"

interface TAuthProps<T> {
    payload: Record<string,T>,
    secret: string,
    TTL: string
}
export const generateAuthToken = <T>({payload, secret, TTL}:TAuthProps<T>) => {
    return sign(payload, secret, { expiresIn: TTL })
}