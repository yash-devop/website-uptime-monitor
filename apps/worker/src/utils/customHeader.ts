export const createHeaders=(headers: {
    [key:string] : string 
} | Request["headers"] )=>{
    return {...headers}
}