import { generateRSSFeed } from "@/helpers/rss-generator";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get("format");

  try {
    const feed = await generateRSSFeed();
    let xml = "";
    switch (format) {
      case "json":
        xml = feed.json1();
        break;
      default:
        xml = feed.atom1();
        break;
    }
    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml"
      }
    })
  } catch (err: any) {
    return new Response("", {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      },
      statusText: err?.message ?? "Error generating feed"
    })
  }
}
