import { mappingMonths } from "./utils";

export const convertMailingListUrlToPath = (url: string) => {
    const baseLink = "https:/lists.linuxfoundation.org/pipermail/";
    const strippedLink = url.split(baseLink)[1].split("/");

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
            return url
        }

        return `${list}/${month}_${year}/${id}`;
    } catch {
        return url
    }
};