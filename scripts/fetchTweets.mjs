import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";

dotenv.config();
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const twitterClient = new TwitterApi(TWITTER_BEARER_TOKEN);

const tweetUrls = [
  "https://x.com/bergealex4/status/1713969652991168655",
  "https://x.com/satsie/status/1714017569726706162",
  "https://x.com/aaaljaz/status/1713969266448347235",
  "https://x.com/callebtc/status/1713964494487994658",
  "https://x.com/moneyball/status/1714089589605077025",
  "https://x.com/mehmehturtle/status/1714150769321030030",
  "https://x.com/timechain_/status/1713990636024606790",
  "https://x.com/BotanixLabs/status/1714264279388426689",
  "https://x.com/aassoiants/status/1713997638129856611",
];

// Utility function to extract tweet IDs from URLs
const extractTweetId = (url) => {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
};

export async function fetchTweets() {
  // Extract tweet IDs
  const tweetIds = tweetUrls.map(extractTweetId).filter(Boolean);

  if (tweetIds.length === 0) {
    throw new Error("No valid tweet IDs found in URLs");
  }

  const readTweetsFile = fs.readFileSync(path.join(process.cwd(), "public", "tweets.json"), "utf8");
  const tweetsFromFile = JSON.parse(readTweetsFile);

  if (tweetsFromFile.length === tweetIds.length) {
    console.log("Fetching tweets from file");
    return tweetsFromFile;
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
      const user = usersById[tweet.author_id];

      return {
        tweet: tweet.text,
        name: user.name,
        username: user.username,
        profileImage: user.profile_image_url,
        url: `https://x.com/${user.username}/status/${tweet.id}`,
      };
    });

    console.log("Writing tweets from API to file");
    fs.writeFileSync(`./public/tweets.json`, JSON.stringify(tweetsWithDetails, null, 2));

    return tweetsWithDetails;
  } catch (error) {
    throw new Error(error.message);
  }
}

fetchTweets();
