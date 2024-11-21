import { ConnectionOptions, Job, Worker } from "bullmq";
import { invokeLambda } from "./invokeLambda";
import { MonitorType } from "@repo/common/src";
import {Redis} from '@upstash/redis'
import { createClient } from "redis";


const connection:ConnectionOptions = {
    host: "localhost",
    port: 6379
}

// const redis = process.env.NODE_ENV === "development" ? createClient() : Redis.fromEnv();            // For development , use Local redis with localhost:6379 and for production, use upstash redis

// const redis = createClient()
const worker = new Worker("HealthCheckQueue",async(job:Job)=>{
    const monitorData :MonitorType = job.data
    const REGIONS = ["ap-south-1"];
    let AWS_RESPONSE:any = []
    REGIONS.forEach(async(region)=>{
        const response = await invokeLambda(region,monitorData)
        const data = JSON.parse(new TextDecoder("utf-8").decode(response.Payload))
        console.log('DATA in FOR LOOP: ', data);
        AWS_RESPONSE.push(data)
    });

    
    console.log('aws_response: ', AWS_RESPONSE);

    // redis.publish("MESSAGE",JSON.stringify({
    //     name: "Yash"
    // }))

},{
    connection,
    // settings:{
        // repeatStrategy
    // }
})


worker.on("completed",()=>{
    console.log('Im free now.');
})