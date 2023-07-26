import { HomepageData, LIGHTNINGDEV, MailingListType } from '@/helpers/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getRelativePathFromLink } from './actions/summary-data'

const Post = ({entry}: {entry: HomepageData["enteries"][number]}) => {
  const type = entry.dev_name
  const path = `summary/${getRelativePathFromLink(entry.link)}`
  return (
    <article className='flex flex-col gap-4 my-8'>
      <div className='flex flex-col md:gap-2'>
        <div className='flex items-center gap-2'>
          <Image src={`/icons/${type}_icon.svg`} width={16} height={16} alt=""/>
          <p className="font-semibold">{type}</p>
        </div>
        <Link href={path} target='_blank' >
          <p className='font-inika text-lg md:text-2xl underline'>{entry.title}</p>
        </Link>
      </div>
      <p className='font-inter text-sm md:text-base font-bold'>{entry.n_threads} replies</p>
      <div className="flex gap-8 text-sm">
        <div className="flex basis-1/3 flex-col gap-1">
          <p className='font-semibold'>Started by</p>
          <Link href={path}>
            <p className="text-brand-secondary underline">
              {entry.authors[0]}
            </p>
          </Link>
        </div>
        <div className="flex basis-2/3 flex-col gap-1">
          <p className='font-semibold'>Involving</p>
          <ContributorsList contributors={entry.contributors} />
        </div>
      </div>
      <div>
        <ul>
          <li>
            {entry.summary}
          </li>
        </ul>
      </div>
    </article>
  )
}

export default Post

export const ContributorsList = ({contributors}: {contributors: string[]}) => {
  const finalList = contributors.slice(0, 2)
  return (
    <p className="inline-flex gap-x-2 flex-wrap text-gray-600">
      {finalList.map((contributor, index) => (<span key={index} className="">{` ${contributor}, `}</span>))}
      {contributors.length > 2 && <span>+{contributors.length - 2} others</span>}
    </p>
  )
}