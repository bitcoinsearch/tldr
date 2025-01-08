import { tweetUrls } from "@/data";
import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import { TWITTER_BEARER_TOKEN } from "@/config/process";
import * as fs from "fs";
import path from "path";
import { Tweet } from "@/helpers/types";

// Initialize Twitter API client
const twitterClient = new TwitterApi(TWITTER_BEARER_TOKEN);

// Utility function to extract tweet IDs from URLs
const extractTweetId = (url: string): string | null => {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
};

export async function GET() {
  // Extract tweet IDs
  const tweetIds = tweetUrls.map(extractTweetId).filter(Boolean) as string[];

  if (tweetIds.length === 0) {
    return NextResponse.json({ error: "No valid tweet IDs found in URLs" }, { status: 400 });
  }

  const readTweetsFile = fs.readFileSync(path.join(process.cwd(), "public", "tweets.json"), "utf8");
  const tweetsFromFile = JSON.parse(readTweetsFile) as Tweet[];

  if (tweetsFromFile.length === tweetIds.length) {
    return NextResponse.json(tweetsFromFile);
  }

  try {
    const tweets = await twitterClient.v2.tweets(tweetIds, {
      expansions: "author_id",
      "tweet.fields": "text",
      "user.fields": "name,username,profile_image_url",
    });

    // Map users by ID for easy lookup to add tweet url manually
    const usersById = Object.fromEntries(tweets.includes?.users?.map((user) => [user.id, user]) || []);

    // Construct response with user image, username, text, and URL
    const tweetsWithDetails = tweets.data.map((tweet) => {
      const user = usersById[tweet.author_id!];

      return {
        tweet: tweet.text,
        name: user.name,
        username: user.username,
        profileImage: user.profile_image_url,
        url: `https://x.com/${user.username}/status/${tweet.id}`,
      };
    });

    fs.writeFileSync(`./public/tweets.json`, JSON.stringify(tweetsWithDetails, null, 2));

    return NextResponse.json(tweetsWithDetails);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
