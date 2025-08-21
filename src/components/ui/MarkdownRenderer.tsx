import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string): string => {
    let result = text;
    
    // Headers
    result = result
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-800 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>');
    
    // Bold
    result = result
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="font-semibold">$1</strong>');
    
    // Italic
    result = result
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/_(.*?)_/g, '<em class="italic">$1</em>');
    
    // Code blocks
    result = result
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto my-3"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Links
    result = result
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Handle lists - group consecutive list items
    const lines = result.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    let listItems: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isListItem = /^[\*\-]\s/.test(line) || /^\d+\.\s/.test(line);
      
      if (isListItem) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        // Convert list item
        const listItem = line
          .replace(/^[\*\-]\s(.*)$/, '<li class="ml-4 mb-1">• $1</li>')
          .replace(/^(\d+)\.\s(.*)$/, '<li class="ml-4 mb-1">$1. $2</li>');
        listItems.push(listItem);
      } else {
        if (inList && listItems.length > 0) {
          // Close the list
          processedLines.push('<ul class="list-none space-y-1 my-3">');
          processedLines.push(...listItems);
          processedLines.push('</ul>');
          inList = false;
          listItems = [];
        }
        processedLines.push(line);
      }
    }
    
    // Handle case where list is at the end
    if (inList && listItems.length > 0) {
      processedLines.push('<ul class="list-none space-y-1 my-3">');
      processedLines.push(...listItems);
      processedLines.push('</ul>');
    }
    
    result = processedLines.join('\n');
    
    // Line breaks and paragraphs
    result = result
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br />')
      .replace(/^(.+)$/gm, '<p class="mb-3">$1</p>')
      .replace(/<p class="mb-3"><\/p>/g, '')
      .replace(/<p class="mb-3"><br \/><\/p>/g, '')
      .replace(/<br \/><br \/>/g, '<br />');
    
    return result;
  };

  const htmlContent = parseMarkdown(content);

  return (
    <div 
      className={`prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-code:bg-gray-100 prose-code:text-gray-800 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;
