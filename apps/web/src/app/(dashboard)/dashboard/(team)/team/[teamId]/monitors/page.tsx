import { headers } from "next/headers"

export default function MonitorPage({
    params
}: {
    params: {
        teamId: string
    }
}) {
    const headerList = headers();
    const pathname = headerList.get("x-current-path");

    console.log('Path in Page : ', pathname);
    return (
        <>
            <p> I am Monitor page with path: {pathname} and teamId: {params.teamId} </p>
        </>
    )
}