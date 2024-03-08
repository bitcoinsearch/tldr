import React from "react";
import ReactMarkdown from "react-markdown";
import "../../globals.css";

export const MarkdownWrapper = ({ summary, className }: { summary: string; className?: string | null | undefined }) => {
  return (
    <ReactMarkdown
      components={{
        a: (props) => <a {...props} className=' text-inherit' target='_blank' />,
      }}
      className={`markdownStyles ${className}`}
    >
      {summary}
    </ReactMarkdown>
  );
};
