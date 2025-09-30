'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Upload, Eye, Check } from 'lucide-react';
import { toast } from 'sonner';
import { createWorkflow } from '@/features/workflow/api';
import { validateWorkflow } from '@/features/workflow/validation/schema';
import { WorkflowJsonViewer } from './workflow-json-viewer';

interface WorkflowActionsProps {
  workflowJson: string;
}

export function WorkflowActions({ workflowJson }: WorkflowActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isInserting, setIsInserting] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(workflowJson);
      setCopied(true);
      toast.success('Workflow JSON copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleInsert = async () => {
    setIsInserting(true);
    try {
      // Parse and validate the workflow
      const workflow = JSON.parse(workflowJson);
      const validation = validateWorkflow(workflow);

      if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(', ');
        toast.error(`Invalid workflow: ${errors}`);
        return;
      }

      // Create workflow in n8n
      const result = await createWorkflow(workflow);
      toast.success(`Workflow "${result.name}" created successfully in n8n!`);
    } catch (err) {
      console.error('Error inserting workflow:', err);
      if (err instanceof SyntaxError) {
        toast.error('Invalid JSON format');
      } else if (err instanceof Error) {
        toast.error(`Failed to insert workflow: ${err.message}`);
      } else {
        toast.error('Failed to insert workflow to n8n');
      }
    } finally {
      setIsInserting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy JSON'}
        </Button>

        <Button
          onClick={handleInsert}
          variant="default"
          size="sm"
          className="gap-2"
          disabled={isInserting}
        >
          <Upload className="h-4 w-4" />
          {isInserting ? 'Inserting...' : 'Insert to n8n'}
        </Button>

        <Button
          onClick={() => setShowJson(!showJson)}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          {showJson ? 'Hide JSON' : 'View JSON'}
        </Button>
      </div>

      {showJson && <WorkflowJsonViewer json={workflowJson} />}
    </div>
  );
}
