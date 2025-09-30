"use client";

import { WorkflowData } from "@/features/chat/types";
import { WorkflowActions } from "./workflow-actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorkflowCardProps {
  workflow: WorkflowData;
  index?: number;
}

export function WorkflowCard({ workflow, index }: WorkflowCardProps) {
  const workflowJson = JSON.stringify(workflow.json, null, 2);
  const nodes = workflow.json.nodes as unknown[] | undefined;
  const nodeCount = nodes?.length || 0;

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {index !== undefined && `${index + 1}. `}
              {workflow.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {workflow.description}
            </CardDescription>
          </div>
          <Badge variant="secondary">{nodeCount} nodes</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <WorkflowActions
          workflowJson={workflowJson}
          workflowName={workflow.name}
        />
      </CardContent>
    </Card>
  );
}
