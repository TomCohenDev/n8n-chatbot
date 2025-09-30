export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}

export interface N8nConnection {
  node: string;
  type: string;
  index: number;
}

export interface N8nWorkflow {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, { main: N8nConnection[][] }>;
  active?: boolean;
  settings?: Record<string, unknown>;
  staticData?: Record<string, unknown>;
}

export interface N8nWorkflowResponse extends N8nWorkflow {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowRequest {
  workflow: N8nWorkflow;
}

export interface CreateWorkflowResponse {
  data: N8nWorkflowResponse;
}
