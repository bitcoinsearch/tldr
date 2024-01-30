import React from "react";
import ReactMarkdown from "react-markdown";
import "../../globals.css";

export const MarkdownWrapper = ({ summary, className }: { summary: string; className?: string | null | undefined }) => {
  return <ReactMarkdown className={`markdownStyles ${className}`} >{summary}</ReactMarkdown>;
};
