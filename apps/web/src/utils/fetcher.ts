export interface FetchError extends Error {
    statusCode: number,
    info: any
}
export async function fetcher(input: RequestInfo, init: RequestInit){
    const res = await fetch(input,init);

    if(!res.ok){
        const error = new Error("An error occured while fetching data") as FetchError;

        error.info = await res.json();
        error.statusCode = res.status

        throw error;
    }

    return await res.json();
}