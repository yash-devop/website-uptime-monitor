// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status   <= Common status codes.
// https://httpstat.us/    <= for generating status codes.
export function isWebsiteUp(statusCode: number ):boolean{
    if(!statusCode) return false;
    if(statusCode < 100 || statusCode > 599){
        throw Error("Please provide a valid status code.")
    }

    return statusCode >= 200 && statusCode <= 400;
}