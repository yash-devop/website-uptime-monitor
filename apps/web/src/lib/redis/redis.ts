// import Redis from 'ioredis'
import {Redis} from '@upstash/redis'
// const getRedisUrl=()=>{
//     console.log('UPSTASH_REDIS_URL',process.env.UPSTASH_REDIS_URL);
//     if(process.env.UPSTASH_REDIS_URL){
//         console.log('yes redis url is there.');
//         return process.env.UPSTASH_REDIS_URL
//     }
//     throw new Error("UPSTASH_REDIS_URL is not defined")
// }

export const redis = Redis.fromEnv()