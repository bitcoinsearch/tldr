import { NextResponse } from "next/server";
import { Client } from "@elastic/elasticsearch";


const client = new Client({
  cloud: {
    id: process.env.NEXT_PUBLIC_ES_CLOUD_ID as string,
  },
  auth: {
    apiKey: process.env.NEXT_PUBLIC_ES_CLOUD_KEY as string,
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");


  const result = await client.search({
    index: process.env.NEXT_PUBLIC_ES_INDEX as string,
    body: {
      query: {
        match: {
          title: `${query}`,
        },
      },
    },
  });

  return NextResponse.json({ result});
}
