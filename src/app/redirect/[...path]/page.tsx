import { getSummaryData } from '@/helpers/fs-functions';
import { convertMailingListUrlToPath } from '@/helpers/redirect-search';
import { redirect } from 'next/navigation';
import React from 'react'

const RedirectPage = async ({ params }: { params: { path: string[] } }) => {
    const fullPath = params.path.join('/');
  
    const decodedPath = decodeURIComponent(fullPath);
    const baseLink = convertMailingListUrlToPath(decodedPath);
    const summaryData = await getSummaryData(baseLink.split("/"));

    if(summaryData){
        return redirect(`/summary/${summaryData.path}`);
    }
    return (
        <div>Redirecting,{fullPath}</div>
    )
}

export default RedirectPage;