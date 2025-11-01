export const featuresSectionData = [
  {
    title: "FOCUSED ON BITCOIN",
    subtext: "100% concentrated on bitcoin and related technologies.",
    icon: "/icons/grey-bitcoin-icon.svg",
  },
  {
    title: "OPEN SOURCE",
    subtext:
      "Everything we do is open source. We want your reviews and contributions.",
    icon: "/icons/grey-github-icon.svg",
  },
  {
    title: "BITCOIN TECH",
    subtext:
      "We focus on enabling devs to learn, practice, and build with bitcoin.",
    icon: "/icons/grey-code-icon.svg",
  },
];

export const exploreSectionData = [
  {
    title: "Active Discussions",
    subtext:
      "Check out posts actively getting replies and inspiring conversations.",
    icon: "/icons/wavy-lines.svg",
    backgroundColor: "#CF661A",
    route: "?source=active-discussions",
  },
  // {
  //   title: "Historic Conversations",
  //   subtext: "Explore posts in this historic deep dive. Surfacing posts where the last reply is in the current month.",
  //   icon: "/icons/brushy-circles.svg",
  //   backgroundColor: "#1486B2",
  //   route: "?source=historic-conversations",
  // },
  {
    title: "All Activity",
    subtext: "Read the most recent individual posts in chronological order.",
    icon: "/icons/brushy-love-icon.svg",
    backgroundColor: "#68910E",
    route: "?source=all-activity",
  },
];

export const summariesSectionData = [
  {
    title: "Bitcoin Dev",
    subtext: "",
    icon: "/icons/bitcoin-dev-icon.svg",
    backgroundColor: "#CF661A",
    route: "?dev=bitcoin-dev#source",
  },
  {
    title: "Delving Bitcoin",
    subtext: "",
    icon: "/icons/delving-bitcoin-icon.svg",
    backgroundColor: "#1486B2",
    route: "?dev=delvingbitcoin#source",
  },
  {
    title: "Lightning Dev (archive)",
    subtext: "",
    icon: "/icons/lightning-icon.svg",
    backgroundColor: "#000000",
    route: "?dev=lightning-dev&source=all-activity",
  },
];

export const menuApps = [
  {
    href: "https://bitcoindevs.xyz/",
    image: "/images/bitcoin-devs.jpg",
    alt: "Bitcoin Devs",
    title: "Study & contribute to bitcoin and lightning open source",
  },
  {
    href: "https://chat.bitcoinsearch.xyz",
    image: "/images/chat-btc.jpg",
    alt: "ChatBTC image",
    title:
      "Interactive AI chat to learn about bitcoin technology and its history",
  },
  {
    href: "https://bitcoinsearch.xyz/",
    image: "/images/bitcoin-search.jpg",
    alt: "Bitcoin search",
    title: "Technical bitcoin search engine",
  },

  {
    href: "https://btctranscripts.com/",
    image: "/images/bitcoin-transcripts.jpg",
    alt: "Bitcoin Transcripts",
    title: "A collection of technical bitcoin and lightning transcripts",
  },
  {
    href: "https://savingsatoshi.com",
    image: "/images/saving-satoshi.jpg",
    alt: "Saving Satoshi",
    title:
      "Engaging bitcoin dev intro for coders using technical texts and code challenges",
  },
  {
    id: "decoding-bitcoin",
    href: "https://bitcoindevs.xyz/decoding",
    image: "/images/decoding-bitcoin.png",
    alt: "Decoding Bitcoin",
    title:
      "Hands on, guided learning to make you confident in bitcoin development.",
  },
  {
    id: "warnet",
    href: "https://warnet.dev/",
    image: "/images/warnet.jpg",
    alt: "Warnet",
    title: "Monitor and analyze the emergent behaviors of P2P networks",
  },
  // {
  //   href: "https://review.btctranscripts.com/",
  //   image: "/images/bitcoin-transcripts-review.jpg",
  //   alt: "Bitcoin Transcripts Review",
  //   title: "Review technical bitcoin transcripts and earn sats",
  // },
];

export const tweetUrls = [
  "https://x.com/bergealex4/status/1713969652991168655",
  "https://x.com/satsie/status/1714017569726706162",
  "https://x.com/aaaljaz/status/1713969266448347235",
  "https://x.com/callebtc/status/1713964494487994658",
  "https://x.com/moneyball/status/1714089589605077025",
  "https://x.com/callebtc/status/1713963375254777963",
  "https://x.com/mehmehturtle/status/1714150769321030030",
  "https://x.com/timechain_/status/1713990636024606790",
  "https://x.com/BotanixLabs/status/1714264279388426689",
  "https://x.com/SimplyBitcoinTV/status/1714219210425971193",
  "https://x.com/aassoiants/status/1713997638129856611",
];

export const MobileNavLinks = [
  {
    title: "Newsletters",
    href: "/newsletters",
    sublinks: [],
    isSubMenu: false,
  },
  {
    title: "Posts",
    href: "/posts",
    sublinks: [
      {
        title: "Active Discussions",
        href: "/posts?source=active-discussions",
      },
      // {
      //   title: "Historic Conversations",
      //   href: "/posts?source=historic-conversations",
      // },
      {
        title: "All Activity",
        href: "/posts?source=all-activity",
      },
      {
        title: "RSS Feed",
        href: "/rss.xml",
      },
    ],
    isSubMenu: true,
  },
  { title: "About", href: "/about", sublinks: [], isSubMenu: false },
];

export const newsLetterIconMap = [
  "/icons/curly-arrow.svg",
  "/icons/thick-stroke.svg",
  "/icons/thick-net.svg",
  "/icons/block-and-circles-icon.svg",
  "/icons/circular-waves-icon.svg",
  "/icons/scattered-shape-icon.svg",
  "/icons/controls-icon.svg",
  "/icons/thick-circles-icon.svg",
  "/icons/bulb-icon.svg",
  "/icons/irregular-stars-icon.svg",
];

export const colorThemes = [
  "#F39595",
  "#FAE1DD",
  "#F1F8B5",
  "#A8D2D1",
  "#DBEDF7",
  "#EECEDB",
  "#DED5CE",
  "#9EA1D4",
  "#9EA1D4",
  "#F1F8B5",
];
