import { mappingMonths, stringToHex } from "./utils";

export const convertLegacyDate = (path: string) => {

    const strippedLink = path.split("/");

    try {
        // return list, year_month
        const [list, year_month, id] = strippedLink;

        // separate month and year from year_month string with the right tldr mapping
        const [year, month] = year_month.split("-").map((i, index) => {
            if (index === 0) return i;
            else {
                const monthIndex = i as keyof typeof mappingMonths;
                return mappingMonths?.[monthIndex] ?? "";
            }
        });

        if (!month || !year || !list) {
            return path
        }

        return `${list}/${month}_${year}/${id}`;
    } catch {
        return path
    }
};

export const convertMailingListUrlToPath = (url: string):string[] => {
    let urlPaths = url.split("/");
    let source = urlPaths.pop();
    if(urlPaths.length > 3){
        
    }
    if(source && source.includes("list-linuxfoundation")){
    
        let reconstructedLegacyPath = convertLegacyDate(url);

        const singlePost = reconstructedLegacyPath;
        const combinedSummary  = reconstructedLegacyPath.replace(/\d+_/,"combined_")

        const hex = [stringToHex(combinedSummary), stringToHex(singlePost)]
        return hex;
    }
    else if(source && source.includes("bitcoin-dev")){
        let fileName = urlPaths[urlPaths.length - 1]
        let singleFileName = urlPaths.pop();
        let path = urlPaths.join("/");
        let combinedFileName = fileName.replace(/\w+_/, "combined_");
        const singlePost = path + `/${singleFileName}`;
        const combinedSummary  = path + `/${combinedFileName}`

        const hex = [stringToHex(combinedSummary), stringToHex(singlePost)]
        return hex;
    }

    return [];
};