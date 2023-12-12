import Link from "next/link";

export default function Page() {
  return (
    <div>
      <section className=''>
        <h2 className='text-2xl md:text-3xl font-normal pb-7 pt-10'>About</h2>
        <p className='whitespace-pre-line'>
          This website presents summaries of the{" "}
          <span>
            <Link href='https://lists.linuxfoundation.org/pipermail/bitcoin-dev/' target='_blank' className='underline text-brand-secondary'>
              bitcoin-dev
            </Link>
          </span>{" "}
          and{" "}
          <span>
            <Link href='https://lists.linuxfoundation.org/pipermail/lightning-dev/' target='_blank' className='underline text-brand-secondary'>
              lightning-dev
            </Link>
          </span>{" "}
          mailing lists.{"\n"}
          {"\n"} The bitcoin-dev and lightning-dev mailing lists are treasure troves of information. Bitcoin-dev alone has 20,000+ posts going back to
          June 2011. There is a problem though, not enough people read it.{"\n"}
          {"\n"} Bitcoin TLDR, is designed to help keep you up to date with the latest posts as well as surface active discussions from the past.
          {"\n"}
          {"\n"} We have created an accessible, understandable, and inviting summary of Bitcoin and Lightning mailing list posts to help you stay up
          to date with all the latest developments.
        </p>
      </section>
      <section>
        <h2 className='text-2xl md:text-3xl font-normal pb-7 pt-10'>How to contribute</h2>
        We’re an open-source project, so you can help us in different ways.
        <p className='font-bold pt-6'>Feedback</p>
        <p>
          A great way to contribute is to go through one or several discussion threads and give us any feedback on the overall experience you might
          have using this{" "}
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
          All suggestions are welcome, including content changes, UI, UX – really anything. For code improvements, you can directly open an issue or
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
        <h2 className='text-2xl md:text-3xl font-normal pb-7 pt-10'>Our commitment to privacy</h2>
        <p className='whitespace-pre-line'>
          At Bitcoin TLDR, we are deeply committed to ensuring the privacy and security of our users. We believe in transparency and want you to
          understand how and why we track app usage. To achieve this, we use a powerful tool called{" "}
          <span>
            <Link href='https://umami.is/' target='_blank' className='underline text-brand-secondary'>
              Umami.
            </Link>
          </span>
        </p>
        <p className='font-bold pt-6'>What is Umami</p>
        <p>
          Umami is an open-source analytics platform that helps us gather essential insights about how you use our app. It allows us to make
          data-driven decisions and continuously enhance our product to better meet your needs. You can view the Umami dashboard{" "}
          <span>
            <Link href='https://visits.bitcoindevs.xyz/share/btDhVSkbULr146OJ/tldr' target='_blank' className='underline text-brand-secondary'>
              here
            </Link>
          </span>
          .
        </p>
        <p className='font-bold pt-6'>What data do we collect</p>
        <p className='pt-1'>Rest assured, we only collect non-personal and anonymized data, such as:</p>
        <ul className='pt-2 list-disc'>
          <li className=''>
            <span className='underline'>Product Improvement:</span> We use the data to identify areas where our app can be improved. By understanding
            how you use our app, we can make it more efficient, user-friendly, and secure.
          </li>
          <li className='pt-6'>
            <span className='underline'>Compatibility:</span>
            {""} Understanding the devices and platforms you use allows us to optimize our app for various configurations, ensuring it works
            seamlessly for you.
          </li>
        </ul>
      </section>
      <section className='pt-9'>
        <Link href='/' className='font-semibold text-2xl'>
          {`Let's`} read!
        </Link>
      </section>
    </div>
  );
}
