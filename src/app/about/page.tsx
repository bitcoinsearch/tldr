import Link from "next/link";
import Wrapper from "../components/server/wrapper";
import Image from "next/image";

export default function Page() {
  return (
    <Wrapper className='px-3 sm:px-5 md:px-8'>
      <div className='max-w-[1090px] w-full mx-auto'>
        <div className='flex flex-col md:flex-row gap-8 lg:gap-[59.39px] items-center justify-between pt-[60px] md:pt-[100px] lg:pt-[163px] pb-[40px] md:pb-[70px] w-full'>
          <section className='flex flex-col gap-4 w-full lg:max-w-[644px]'>
            <h1 className='text-start text-[32px] md:text-[48px] xl:text-[64px] font-normal font-test-signifier leading-[41.38px] md:leading-[60px] xl:leading-[82.75px]'>
              About <span className='text-orange-custom-100'>TLDR</span>
            </h1>
            <p className='text-sm md:text-lg leading-[32px] font-normal font-gt-walsheim text-black w-full'>
              This website summarizes the{" "}
              <span className='underline text-orange-custom-100'>
                <Link href='https://lists.linuxfoundation.org/pipermail/bitcoin-dev/' target='_blank'>
                  bitcoin-dev
                </Link>
              </span>
              ,{" "}
              <span className='underline text-orange-custom-100'>
                <Link href='https://www.mail-archive.com/lightning-dev@lists.linuxfoundation.org/' target='_blank'>
                  lightning-dev
                </Link>
              </span>{" "}
              and{" "}
              <span className='underline text-orange-custom-100'>
                <Link href='https://delvingbitcoin.org/' target='_blank'>
                  delving bitcoin
                </Link>
              </span>{" "}
              mailing lists. The bitcoin-dev and lightning-dev mailing lists are treasure troves of information. Bitcoin-dev alone has 20,000+ posts
              going back to June 2011. There is a problem though, not enough people read it. Bitcoin TLDR is designed to help keep you up to date with
              the latest posts as well as surface active discussions from the past. We summarize every post and then summarize the summaries so that
              every thread summary remains fresh based on the replies. These run on nightly cron jobs to produce{" "}
              <span>
                <Link
                  href='https://github.com/bitcoinsearch/mailing-list-summaries/tree/main/static'
                  target='_blank'
                  className='underline text-orange-custom-100'
                >
                  static files
                </Link>
              </span>{" "}
              that we encourage you to use for your own projects.
            </p>
          </section>
          <Image
            src='/icons/thinking-woman.svg'
            alt='thinking woman'
            className='w-[198px] md:w-[270px] lg:w-[386px]'
            height={386.61}
            width={386.61}
          />
        </div>

        <div className='flex flex-col gap-4 md:gap-6 py-8 md:py-20'>
          <section className='flex flex-col gap-4 max-w-[533px]'>
            <h1 className='text-start text-[32px] md:text-[48px] xl:text-[64px] font-normal font-test-signifier leading-[41.38px] md:leading-[60px] xl:leading-[82.75px]'>
              How to Contribute
            </h1>
            <p className='text-sm md:text-lg leading-[32px] font-gt-walsheim text-black'>
              We are an open-source project, so you can help us in different ways.
            </p>
          </section>

          <section className='flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-between'>
            <Image src='/icons/girl-making-announcement.svg' alt='thinking woman' height={290} width={290} className='w-[198px] sm:w-[290px]' />
            <section className='flex flex-col md:gap-6 max-w-[678px] relative'>
              <section className='relative'>
                <AboutPageCard title='Feedback'>
                  A valuable contribution would be to review one or several discussion threads and provide feedback on your overall experience using
                  this{" "}
                  <span className='underline text-orange-custom-100'>
                    <Link href='https://cryptpad.fr/form/#/2/form/view/3P2CsohsHOkcH7C+WdtX0-tvqjBHqXnAmz5D9yx0e04/' target='_blank'>
                      form
                    </Link>
                  </span>
                  .
                </AboutPageCard>
                <div className='w-[4px] h-full md:hidden z-50 bg-orange-custom-100 absolute top-0 left-0'></div>
              </section>
              <AboutPageCard title='Contribute'>
                All suggestions are welcome, including content changes, UI, UX - really anything. For code improvements, you can directly open an
                issue or submit a pull request on{" "}
                <span className='underline text-orange-custom-100'>
                  <Link href='https://github.com/bitcoinsearch/tldr' target='_blank'>
                    GitHub
                  </Link>
                </span>
                .
              </AboutPageCard>
              <div className='w-[2px] md:hidden h-full bg-gray-custom-250 absolute top-0 left-0'></div>
            </section>
          </section>
        </div>
      </div>
    </Wrapper>
  );
}

const AboutPageCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className='flex flex-col gap-2 pt-0 pb-6 pl-5 p-4 md:pt-6 md:p-6 rounded-none md:rounded-[20px] bg-transparent md:bg-gray-custom-700'>
      <h5 className='text-2xl leading-[31.03px] font-test-signifier font-medium'>{title}</h5>
      <section className='font-gt-walsheim text-sm md:text-base leading-8'>{children}</section>
    </div>
  );
};
