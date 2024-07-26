import Link from "next/link";

export default function NotFound() {
  return (
    <main id='main' className='flex w-full items-center justify-center h-full pb-[60px]'>
      <div className='w-full'>
        <div className='flex flex-col items-center justify-center gap-y-6 w-full h-full'>
          <h1 className='md:text-4xl font-bold text-center'>404 - Page Not Found</h1>
          <p className='text-sm md:text-lg text-center max-w-xs md:max-w-lg'>
            The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
          </p>
          <Link
            href='/'
            className='flex justify-center items-center gap-2 py-3 px-4 font-bold mx-auto text-sm text-black lg:text-base bg-gray-200 disabled:bg-custom-hover-state disabled:cursor-not-allowed rounded-[10px]'
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
