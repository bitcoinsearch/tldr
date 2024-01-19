import React from "react";
import ReactMarkdown from "react-markdown";
import '../../globals.css'

export const MarkdownWrapper = ({ summary }: { summary: string }) => {
  return <ReactMarkdown className='font-inika text-sm md:text-lg text-gray-800 markdownStyles'>{summary}</ReactMarkdown>;
};
