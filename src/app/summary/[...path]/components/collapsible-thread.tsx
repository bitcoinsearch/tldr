"use client";

import { useState, useEffect, useRef } from "react";
import { sortedAuthorData } from "@/helpers/types";
import { formatDateString, getUtcTime, stringToHex } from "@/helpers/utils";
import Link from "next/link";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface ThreadNode {
  author: sortedAuthorData;
  children: ThreadNode[];
  isExpanded: boolean;
  hasChildren: boolean;
}

interface CollapsibleThreadProps {
  authors: sortedAuthorData[];
  historyLinks: string[];
  originalPostLink: string;
  currentReplyLink?: string;
  isPostSummary?: boolean;
  firstPost?: string;
  linkByAnchor?: Record<string, string>;
}

export const CollapsibleThread = ({
  authors,
  historyLinks,
  originalPostLink,
  currentReplyLink,
  isPostSummary,
  firstPost,
  linkByAnchor,
}: CollapsibleThreadProps) => {
  // Keep a generous max indent; horizontal scroll will handle overflow on mobile
  const [maxIndentPx, setMaxIndentPx] = useState<number>(2000);

  useEffect(() => {
    const update = () => setMaxIndentPx(2000);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  // Map each displayed author to its corresponding link using linkByAnchor when available
  const linkMap = new Map<string, string>();
  
  authors.forEach((author, i) => {
    const key = author.anchor || `${author.name}-${author.dateInMS}`;
    
    // First try to use linkByAnchor mapping if available
    if (linkByAnchor) {
      const byAnchorKey = author.anchor;
      const byLegacyKey = `${author.name}-${author.dateInMS}`;
      
      if (byAnchorKey && linkByAnchor[byAnchorKey]) {
        linkMap.set(key, linkByAnchor[byAnchorKey] + ".xml");
      } else if (linkByAnchor[byLegacyKey]) {
        linkMap.set(key, linkByAnchor[byLegacyKey] + ".xml");
      } else {
        // Fallback to index-based mapping
        const link = historyLinks[i] || "";
        linkMap.set(key, link);
      }
    } else {
      // Fallback to index-based mapping when linkByAnchor is not available
      const link = historyLinks[i] || "";
      linkMap.set(key, link);
    }
  });
  // Initialize expanded nodes to show the current active message and its ancestors
  const getInitialExpandedNodes = (): Set<string> => {
    if (!currentReplyLink || isPostSummary) {
      return new Set(); // Start collapsed if no specific message is selected
    }

    const expandedNodes = new Set<string>();
    
    // Find the current active message
    const activeAuthor = authors.find(author => {
      const key = author.anchor || `${author.name}-${author.dateInMS}`;
      const link = linkMap.get(key) || "";
      const path = link.replace(/\.xml$/, "");
      const hexLink = stringToHex(path);
      return hexLink === currentReplyLink;
    });

    if (activeAuthor) {
      // Expand all ancestors of the active message
      const expandAncestors = (author: sortedAuthorData) => {
        const nodeId = author.anchor || `${author.name}-${author.dateInMS}`;
        expandedNodes.add(nodeId);
        
        // Find parent and expand it recursively
        if (author.parent_id) {
          const parentAnchor = author.parent_id.split('-').slice(-1)[0];
          const parentAuthor = authors.find(a => 
            (a.anchor || `${a.name}-${a.dateInMS}`) === parentAnchor
          );
          if (parentAuthor) {
            expandAncestors(parentAuthor);
          }
        }
      };

      expandAncestors(activeAuthor);
    }

    return expandedNodes;
  };

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(getInitialExpandedNodes());
  const activeMessageRef = useRef<HTMLDivElement>(null);
  
  

  // Scroll to active message when component mounts
  useEffect(() => {
    if (activeMessageRef.current && currentReplyLink && !isPostSummary) {
      // Small delay to ensure the tree is fully rendered
      setTimeout(() => {
        activeMessageRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [currentReplyLink, isPostSummary]);

  // Check if this is a legacy flat structure (no threading data)
  const hasThreadingData = authors.some(author => 
    author.depth !== undefined && author.depth > 0
  );

  // Identify the true original post - the chronologically first root-level post
  const getOriginalPostAuthor = (): sortedAuthorData | null => {
    if (firstPost) {
      // If firstPost is explicitly provided, find that author
      const firstPostPath = firstPost.replace(/\.xml$/, "");
      const firstPostHex = stringToHex(firstPostPath);
      
      for (let i = 0; i < authors.length; i++) {
        const keyForLink = authors[i].anchor || `${authors[i].name}-${authors[i].dateInMS}`;
        const link = linkMap.get(keyForLink) || "";
        const path = link.replace(/\.xml$/, "");
        const hexLink = stringToHex(path);
        if (hexLink === firstPostHex) {
          return authors[i];
        }
      }
    }
    
    // Otherwise, find the chronologically first root-level post (depth 0 or no parent)
    if (hasThreadingData) {
      const rootAuthors = authors.filter(a => !a.parent_id || a.depth === 0);
      if (rootAuthors.length > 0) {
        // Return the one with the earliest date
        return rootAuthors.reduce((earliest, current) => 
          current.dateInMS < earliest.dateInMS ? current : earliest
        );
      }
    }
    
    // Fallback: return the chronologically first author
    return authors.length > 0 ? authors.reduce((earliest, current) => 
      current.dateInMS < earliest.dateInMS ? current : earliest
    ) : null;
  };

  const originalPostAuthor = getOriginalPostAuthor();

  // Build tree structure from flat authors list
  const buildTree = (): ThreadNode[] => {
    const nodeMap = new Map<string, ThreadNode>();
    const rootNodes: ThreadNode[] = [];

    // Create nodes for all authors
    authors.forEach((author, index) => {
      const nodeId = author.anchor || `${author.name}-${author.dateInMS}`;
      nodeMap.set(nodeId, {
        author,
        children: [],
        isExpanded: true,
        hasChildren: false,
      });
    });

    if (hasThreadingData) {
      // Build parent-child relationships for threaded structure
      authors.forEach((author) => {
        const nodeId = author.anchor || `${author.name}-${author.dateInMS}`;
        const node = nodeMap.get(nodeId);
        
        if (node && author.parent_id) {
          const parentAnchor = author.parent_id.split('-').slice(-1)[0];
          const parentNode = nodeMap.get(parentAnchor);
          
          if (parentNode) {
            parentNode.children.push(node);
            parentNode.hasChildren = true;
          }
        } else if (node) {
          // Root node
          rootNodes.push(node);
        }
      });

      // Sort children by timestamp
      const sortChildren = (node: ThreadNode) => {
        node.children.sort((a, b) => a.author.dateInMS - b.author.dateInMS);
        node.children.forEach(sortChildren);
      };
      
      rootNodes.forEach(sortChildren);
    } else {
      // For legacy flat structure, all authors are root nodes
      authors.forEach((author) => {
        const nodeId = author.anchor || `${author.name}-${author.dateInMS}`;
        const node = nodeMap.get(nodeId);
        if (node) {
          rootNodes.push(node);
        }
      });
      
      // Sort by timestamp
      rootNodes.sort((a, b) => a.author.dateInMS - b.author.dateInMS);
    }

    return rootNodes;
  };

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderThreadNode = (node: ThreadNode, depth: number = 0): JSX.Element => {
    const nodeId = node.author.anchor || `${node.author.name}-${node.author.dateInMS}`;
    const isExpanded = expandedNodes.has(nodeId) || depth === 0; // Root always expanded
    const keyForLink = node.author.anchor || `${node.author.name}-${node.author.dateInMS}`;
    const link = linkMap.get(keyForLink) || "";
    const path = link.replace(/\.xml$/, "");
    const hexLink = stringToHex(path);
    
    // Check if this author has a valid link (XML file available)
    const hasValidLink = link && link.trim() !== "";
    
    // Only consider active if we have a valid link and it matches the current reply
    const isActive = !isPostSummary && hasValidLink && hexLink === currentReplyLink;
    
    // Check if this node is the original post by comparing with the identified original post author
    const isOriginalPost = originalPostAuthor && 
                          node.author.dateInMS === originalPostAuthor.dateInMS &&
                          node.author.name === originalPostAuthor.name;

    return (
      <div key={nodeId} className="thread-node">
        <div 
          ref={isActive ? activeMessageRef : undefined}
          className={`flex items-center gap-2 p-2 rounded-lg transition-colors min-w-[400px] ${
            isActive ? "bg-orange-custom-200 border-l-4 border-orange-custom-100" : "hover:bg-gray-custom-100"
          } ${!hasValidLink ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ marginLeft: hasThreadingData ? `${Math.min(depth * 20, maxIndentPx)}px` : '0px' }}
        >
          {/* Expand/Collapse Button - show space for consistent alignment */}
          {hasThreadingData && (
            <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
              {node.hasChildren ? (
                <button
                  onClick={() => toggleExpanded(nodeId)}
                  className="flex items-center justify-center w-5 h-5 rounded hover:bg-gray-custom-200 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="w-4 h-4 text-gray-custom-1100" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4 text-gray-custom-1100" />
                  )}
                </button>
              ) : (
                /* Empty space to maintain alignment */
                <div className="w-5 h-5"></div>
              )}
            </div>
          )}
          
          {/* Message Content */}
          {hasValidLink ? (
            <Link
              href={`/posts/${originalPostLink}-${hexLink}`}
              className="flex-1 flex flex-col gap-1 min-w-0"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-test-signifier font-medium whitespace-nowrap ${isActive ? "text-orange-custom-100" : "text-gray-custom-1200"}`}>
                  {node.author.name}
                </span>
                {isOriginalPost && (
                  <span className="px-2 py-1 text-xs text-white rounded-full whitespace-nowrap" style={{ backgroundColor: "#f6931b" }}>
                    Original Post
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-custom-1100 font-gt-walsheim flex-wrap">
                <span className="whitespace-nowrap">{formatDateString(node.author.date, true)}</span>
                <span className="text-gray-custom-1200">/</span>
                <span className="whitespace-nowrap">{(() => {
                  try {
                    const date = new Date(node.author.dateInMS);
                    if (isNaN(date.getTime())) {
                      return 'Invalid Date';
                    }
                    return getUtcTime(date.toISOString());
                  } catch (error) {
                    return 'Invalid Date';
                  }
                })()}</span>
              </div>
            </Link>
          ) : (
            <div className="flex-1 flex flex-col gap-1 min-w-0 cursor-not-allowed">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-test-signifier font-medium whitespace-nowrap ${isActive ? "text-orange-custom-100" : "text-gray-custom-1200"}`}>
                  {node.author.name}
                </span>
                {isOriginalPost && (
                  <span className="px-2 py-1 text-xs text-white rounded-full whitespace-nowrap" style={{ backgroundColor: "#f6931b" }}>
                    Original Post
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-custom-1100 font-gt-walsheim flex-wrap">
                <span className="whitespace-nowrap">{formatDateString(node.author.date, true)}</span>
                <span className="text-gray-custom-1200">/</span>
                <span className="whitespace-nowrap">{(() => {
                  try {
                    const date = new Date(node.author.dateInMS);
                    if (isNaN(date.getTime())) {
                      return 'Invalid Date';
                    }
                    return getUtcTime(date.toISOString());
                  } catch (error) {
                    return 'Invalid Date';
                  }
                })()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Render Children - only for threaded structure */}
        {hasThreadingData && isExpanded && node.children.map(child => renderThreadNode(child, depth + 1))}
      </div>
    );
  };

  const tree = buildTree();
  const totalMessages = authors.length;
  const totalReplies = totalMessages - 1;

  return (
    <div className="collapsible-thread">
      {/* Thread Header */}
      <div className="bg-orange-custom-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-test-signifier font-semibold text-gray-custom-1200">
              {hasThreadingData ? 'Thread Overview' : 'Message History'}
            </h3>
            <p className="text-sm text-gray-custom-1100 font-gt-walsheim">
              {totalMessages} messages{hasThreadingData ? ` • ${totalReplies} replies` : ''}
            </p>
          </div>
          {/* Only show expand/collapse buttons for threaded structure */}
          {hasThreadingData && (
            <div className="flex gap-2">
              <button
                onClick={() => setExpandedNodes(new Set())}
                className="px-3 py-1 text-xs bg-gray-custom-200 hover:bg-gray-custom-300 rounded transition-colors font-gt-walsheim text-gray-custom-1200"
              >
                Collapse All
              </button>
              <button
                onClick={() => {
                  const allNodeIds = authors.map(a => a.anchor || `${a.name}-${a.dateInMS}`);
                  setExpandedNodes(new Set(allNodeIds));
                }}
                className="px-3 py-1 text-xs bg-gray-custom-200 hover:bg-gray-custom-300 rounded transition-colors font-gt-walsheim text-gray-custom-1200"
              >
                Expand All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Thread Tree */}
      <div className="space-y-1">
        {tree.map(rootNode => renderThreadNode(rootNode))}
      </div>
    </div>
  );
};
