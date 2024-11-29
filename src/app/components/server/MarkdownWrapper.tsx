import React from "react";
import ReactMarkdown from "react-markdown";

export const MarkdownWrapper = ({ summary, className }: { summary: string; className?: string | null | undefined }) => {
  return (
    <ReactMarkdown
      components={{
        a: ({node, ...props}) => {
          return <a {...props} className='text-inherit' target='_blank' />
        },
      }}
      className={`markdownStyles break-words ${className}`}
    >
      {summary}
    </ReactMarkdown>
  );
};
