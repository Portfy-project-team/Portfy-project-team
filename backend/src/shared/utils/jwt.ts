import {Role,UserStatus} from '@prisma/client'
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import {z} from 'zod'
const envSchema = z.object({
ACCESS_TOKEN_SECRET:z.string().min(1),
REFRESH_TOKEN_SECRET:z.string().min(1),
ACCESS_TOKEN_EXPIRES_IN:z.string().default("15m"),
REFRESH_TOKEN_EXPIRES_IN:z.string().default("7d")

})
const env = envSchema.parse(process.env)

export const TokenSchema = z.object( {
userId:z.number(),
role:z.nativeEnum(Role),
})

export type TokenPayload = z.infer<typeof TokenSchema>

export const generateAccessToken = (payload:TokenPayload):string=>
   jwt.sign(payload,env.ACCESS_TOKEN_SECRET,{expiresIn:env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]})

export const generateRefreshToken = (payload:TokenPayload):string=>
    jwt.sign(payload,env.REFRESH_TOKEN_SECRET,{expiresIn:env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]})


export const verifytAccessToken = (token:string):TokenPayload =>{
  const decoded =  jwt.verify(token,env.ACCESS_TOKEN_SECRET) 
  const result  = TokenSchema.safeParse(decoded)
  if(!result.success)
   throw new Error("invalid  token payload")

  return result.data
}
export const verifyRefreshToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET)

  const result = TokenSchema.safeParse(decoded)

  if (!result.success) {
    throw new Error("invalid refresh token payload")
  }

  return result.data
}
export const getRefreshTokenExpiry = ():Date =>{
   const date = new Date()
   date.setDate(date.getDate()+7)
   return date
}
