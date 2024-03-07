import {sign,verify} from "jsonwebtoken"
const secretPassword=process.env.MYSECRETPASSWORD as string
interface tokenData{
    username:string
}
export const generateToken=(data:tokenData):string=>{
    const token=sign(data,secretPassword)
    return token
}
export const verifyToken=(token:string)=>{
    return verify(token,secretPassword) as tokenData
}
