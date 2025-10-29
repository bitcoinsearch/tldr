import React from "react";
import ReactMarkdown from "react-markdown";

export const MarkdownWrapper = ({ summary, className }: { summary: string; className?: string | null | undefined }) => {
  // convert single newlines to double newlines for paragraph breaks
  const processedSummary = summary.replace(/\n(?!\n)/g, '\n\n');
  
  return (
    <ReactMarkdown
      components={{
        a: ({node, ...props}) => {
          return <a {...props} className='text-inherit' target='_blank' />
        },
      }}
      className={`markdownStyles break-words ${className}`}
    >
      {processedSummary}
    </ReactMarkdown>
  );
};
