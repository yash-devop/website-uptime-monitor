import { auth } from "@/utils/auth"
import { NextRequest } from "next/server"
export const authMiddleware = auth

export const middleware=async(req:NextRequest)=>{
   if(req.nextUrl.pathname.startsWith("/server")){
       return await authMiddleware(req as any)
   }
}


export const config = {
   matcher: "/server(.*)"
}