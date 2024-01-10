import { PageConfig } from "next";
import { type NextRequest } from "next/server";

export const runtime = "edge"

const url = process.env.NEWSLETTER_FORM_URL || "";

export async function POST(request: NextRequest) {
  try {
    const reqBody = new URLSearchParams(await request.text());
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: reqBody,
    });

    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : 500,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An Error Occurred",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
