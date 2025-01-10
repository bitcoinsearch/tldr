import Link from "next/link";

export default function Page() {
  return (
    <div className='w-full mx-auto grow max-w-3xl pb-8 px-4 lg:px-0'>
      <section>
        <h2 className='text-2xl md:text-3xl font-normal pb-7 pt-10'>About</h2>
        <p className='whitespace-pre-line'>
          This website summarizes the{" "}
          <span>
            <Link href='https://lists.linuxfoundation.org/pipermail/bitcoin-dev/' target='_blank' className='underline text-brand-secondary'>
              bitcoin-dev
            </Link>
          </span>
          ,{" "}
          <span>
            <Link href='https://lists.linuxfoundation.org/pipermail/lightning-dev/' target='_blank' className='underline text-brand-secondary'>
              lightning-dev
            </Link>
          </span>{" "}
          and{" "}
          <span>
            <Link href='https://https://delvingbitcoin.org/' target='_blank' className='underline text-brand-secondary'>
              delving bitcoin
            </Link>
          </span>{" "}
          mailing lists.{"\n"}
          {"\n"} The bitcoin-dev and lightning-dev mailing lists are treasure troves of information. Bitcoin-dev alone has 20,000+ posts going back to
          June 2011. There is a problem though, not enough people read it.{"\n"}
          {"\n"} Bitcoin TLDR is designed to help keep you up to date with the latest posts as well as surface active discussions from the past.
          {"\n"}
          {"\n"} We summarize every post and then summarize the summaries so that every thread summary remains fresh based on the replies. These run
          on nightly cron jobs to produce{" "}
          <span>
            <Link
              href='https://github.com/bitcoinsearch/mailing-list-summaries/tree/main/static'
              target='_blank'
              className='underline text-brand-secondary'
            >
              static files
            </Link>
          </span>{" "}
          that we encourage you to use for your own projects.
        </p>
      </section>
      <section>
        <h2 className='text-2xl md:text-3xl font-normal pb-7 pt-10'>How to contribute</h2>
        We are an open-source project, so you can help us in different ways.
        <p className='font-bold pt-6'>Feedback</p>
        <p>
          A valuable contribution would be to review one or several discussion threads and provide feedback on your overall experience using this{" "}
          <span>
            <Link
              href='https://cryptpad.fr/form/#/2/form/view/3P2CsohsHOkcH7C+WdtX0-tvqjBHqXnAmz5D9yx0e04/'
              target='_blank'
              className='underline text-brand-secondary'
            >
              form.
            </Link>
          </span>
        </p>
        <p className='font-bold pt-6'>Contribute</p>
        <p>
          All suggestions are welcome, including content changes, UI, UX - really anything. For code improvements, you can directly open an issue or
          submit a pull request on{" "}
          <span>
            <Link href='https://github.com/bitcoinsearch/tldr' target='_blank' className='underline text-brand-secondary'>
              GitHub
            </Link>
          </span>
          .
        </p>
      </section>
      <section>
        <h2 className='text-2xl md:text-3xl font-normal pb-7 pt-10'>Privacy</h2>
        <p className='whitespace-pre-line'>
          We use an open source analytics tool called Umami to help us improve this product. You can view the Umami dashboard{" "}
          <span>
            <Link href='https://visits.bitcoindevs.xyz/share/btDhVSkbULr146OJ/tldr' target='_blank' className='underline text-brand-secondary'>
              here
            </Link>
          </span>
          .
        </p>
      </section>
    </div>
  );
}
