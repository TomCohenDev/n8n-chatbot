'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface WorkflowJsonViewerProps {
  json: string;
}

export function WorkflowJsonViewer({ json }: WorkflowJsonViewerProps) {
  let formattedJson = json;
  
  try {
    // Try to parse and pretty-print the JSON
    const parsed = JSON.parse(json);
    formattedJson = JSON.stringify(parsed, null, 2);
  } catch (error) {
    // If parsing fails, use the original string
    console.error('Failed to parse JSON:', error);
  }

  return (
    <div className="rounded-lg overflow-hidden border">
      <SyntaxHighlighter
        language="json"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          maxHeight: '400px',
          fontSize: '12px',
        }}
      >
        {formattedJson}
      </SyntaxHighlighter>
    </div>
  );
}
