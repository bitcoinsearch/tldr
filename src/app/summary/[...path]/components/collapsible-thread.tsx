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
}

export const CollapsibleThread = ({
  authors,
  historyLinks,
  originalPostLink,
  currentReplyLink,
  isPostSummary,
  firstPost,
}: CollapsibleThreadProps) => {
  // Keep a generous max indent; horizontal scroll will handle overflow on mobile
  const [maxIndentPx, setMaxIndentPx] = useState<number>(2000);

  useEffect(() => {
    const update = () => setMaxIndentPx(2000);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  // Map each displayed author (in current order) to its corresponding link
  const linkMap = new Map<string, string>();
  authors.forEach((author, i) => {
    const key = author.anchor || `${author.name}-${author.dateInMS}`;
    linkMap.set(key, historyLinks[i] || "");
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
    try {
      if (node.author.anchor) {
        console.log("[thread-ui] render node", {
          name: node.author.name,
          anchor: node.author.anchor,
          idx: node.author.initialIndex,
          link,
          path,
        });
      }
    } catch (e) {}
    const hexLink = stringToHex(path);
    const isActive = !isPostSummary && hexLink === currentReplyLink;
    const isOriginalPost = firstPost && hexLink === stringToHex(firstPost.replace(/\.xml$/, ""));

    return (
      <div key={nodeId} className="thread-node">
        <div 
          ref={isActive ? activeMessageRef : undefined}
          className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
            isActive ? "bg-orange-custom-200 border-l-4 border-orange-custom-100" : "hover:bg-gray-custom-100"
          }`}
          style={{ marginLeft: hasThreadingData ? `${Math.min(depth * 20, maxIndentPx)}px` : '0px' }}
        >
          {/* Expand/Collapse Button - show space for consistent alignment */}
          {hasThreadingData && (
            <div className="flex items-center justify-center w-5 h-5">
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
          <Link
            href={`/posts/${originalPostLink}-${hexLink}`}
            className="flex-1 flex flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <span className={`font-test-signifier font-medium ${isActive ? "text-orange-custom-100" : "text-gray-custom-1200"}`}>
                {node.author.name}
              </span>
              {isOriginalPost && (
                <span className="px-2 py-1 text-xs text-white rounded-full" style={{ backgroundColor: "#f6931b" }}>
                  Original Post
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-custom-1100 font-gt-walsheim">
              <span>{formatDateString(node.author.date, true)}</span>
              <span className="text-gray-custom-1200">/</span>
              <span>{(() => {
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

      {/* Thread Tree - allow horizontal scroll on small screens for deep nesting */}
      <div className="space-y-1 overflow-x-auto">
        {tree.map(rootNode => renderThreadNode(rootNode))}
      </div>
    </div>
  );
};
