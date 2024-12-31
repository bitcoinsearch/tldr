import Navbar from "@/app/components/server/navbar";
import "@bitcoin-dev-project/bdp-ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Inika } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const inika = Inika({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inika",
});

export const metadata: Metadata = {
  title: "Bitcoin TLDR",
  alternates: {
    types: {
      'application/rss+xml': './rss.xml',
    }
  },
  description: "Bitcoin-dev and Lightning-dev mailing list summaries and discoveries",
  keywords:
    "bitcoin, bitcoin development, bitcoin tldr, bitcoin tl;dr, bitcoin learning, bitcoin resources, bitcoin resources for beginners, bitcoin resources for developers, bitcoin resources for beginners and developers, bitcoin resources for beginners and developers",
  openGraph: {
    title: "Bitcoin TLDR",
    description: "Bitcoin-dev and Lightning-dev mailing list summaries and discoveries",
    url: "https://tldr.bitcoinsearch.xyz",
    type: "website",
    images: [
      {
        url: "https://tldr.bitcoinsearch.xyz/images/laughing_cat_sq.jpg",
      },
    ],
  },
  twitter: {
    card: "summary",
    creator: "@chaincodelabs",
    images: ["https://tldr.bitcoinsearch.xyz/images/laughing_cat_landscape.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='h-full'>
      <body className={`${inter.variable} ${inika.variable} font-inter h-full`}>
        <div className='pt-2 md:pt-[56px] w-full items-center h-full flex flex-col'>
          <div className='w-full grow flex flex-col'>
            <div className='sticky top-0 z-50'>
              <div className='sticky top-0 z-[99]'>
                <div className='sticky top-0 bg-white w-full max-h-[98px] flex flex-col items-center p-2 md:p-4 px-4 z-[99] justify-center'>
                  <Navbar />
                </div>
              </div>
            </div>
            <div className='w-full mx-auto grow max-w-3xl pb-8 px-4 lg:px-0'>{children}</div>
            <footer className="p-[24px] bg-black dark:bg-black text-white text-center w-full">
              <p style={{ fontSize: "16px", color: "lightgray" }}>
                Built with ❤️ by{" "}
                <a href='https://bitcoindevs.xyz' target='_blank' rel='noopener noreferrer' style={{ color: "orange" }}>
                  The Bitcoin Dev Project
                </a>
              </p>
              <a
                href='https://cryptpad.fr/form/#/2/form/view/3P2CsohsHOkcH7C+WdtX0-tvqjBHqXnAmz5D9yx0e04/'
                target='_blank'
                rel='noopener noreferrer'
                style={{ fontSize: "14px", color: "orange" }}
              >
                Submit Feedback
              </a>
              <p style={{ fontSize: "14px", color: "lightgray" }}>
                Vistor counts publicly available via {" "}
                <a
                  href='https://visits.bitcoindevs.xyz/share/btDhVSkbULr146OJ/tldr'
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ fontSize: "14px", color: "orange" }}
                >
                  umami
                </a>
              </p>
            </footer>
          </div>
        </div>
        <script async src="https://visits.bitcoindevs.xyz/script.js" data-website-id="a711d1d5-764e-461e-83bd-d715c5b8cb29"></script>
      </body>
    </html>
  );
}
