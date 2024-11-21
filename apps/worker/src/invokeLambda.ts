import {InvokeCommand, LambdaClient} from '@aws-sdk/client-lambda';
import {config} from 'dotenv';

config();       // enables to access env vars.
console.log("KEY",process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY) 

export async function invokeLambda<T>(region: string,payload: T ){
    const client = new LambdaClient({
        region,
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
    })
    console.log('payload: ', payload);
    const invocationCommand = new InvokeCommand({
        FunctionName: "checking-service-dev-logger",
        Payload: Buffer.from(JSON.stringify(payload))
    })


    try {
        const response = await client.send(invocationCommand);
        console.log("🐳🐳 Invoke Lambda Response:", Buffer.from(response.Payload || "").toString());
        return response;
      } catch (error) {
        console.error("Error invoking Lambda:", error);
        throw error;
      }
}