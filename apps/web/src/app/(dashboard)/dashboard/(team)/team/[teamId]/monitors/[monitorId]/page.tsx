export default async function MonitorIDPage({
    params
}:{
    params: Promise<{
        monitorId: string
    }>
}){
    const {monitorId} = await params;
    return (
        <>
            Monitor id is {monitorId}
        </>
    )
}