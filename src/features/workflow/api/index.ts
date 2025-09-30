import { n8nApiClient } from '@/lib/api-client';
import { N8nWorkflow, N8nWorkflowResponse } from '../types';

export interface WorkflowListResponse {
  data: N8nWorkflowResponse[];
}

/**
 * Fetch all workflows from n8n
 */
export async function getWorkflows(): Promise<N8nWorkflowResponse[]> {
  try {
    const response = await n8nApiClient.get<WorkflowListResponse>('/workflows');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching workflows:', error);
    throw new Error('Failed to fetch workflows from n8n');
  }
}

/**
 * Fetch a single workflow by ID
 */
export async function getWorkflow(id: string): Promise<N8nWorkflowResponse> {
  try {
    const response = await n8nApiClient.get<{ data: N8nWorkflowResponse }>(`/workflows/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching workflow ${id}:`, error);
    throw new Error(`Failed to fetch workflow ${id} from n8n`);
  }
}

/**
 * Create a new workflow in n8n
 */
export async function createWorkflow(workflow: N8nWorkflow): Promise<N8nWorkflowResponse> {
  try {
    const response = await n8nApiClient.post<{ data: N8nWorkflowResponse }>('/workflows', workflow);
    return response.data.data;
  } catch (error) {
    console.error('Error creating workflow:', error);
    throw new Error('Failed to create workflow in n8n');
  }
}

/**
 * Update an existing workflow
 */
export async function updateWorkflow(
  id: string,
  workflow: Partial<N8nWorkflow>
): Promise<N8nWorkflowResponse> {
  try {
    const response = await n8nApiClient.patch<{ data: N8nWorkflowResponse }>(
      `/workflows/${id}`,
      workflow
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating workflow ${id}:`, error);
    throw new Error(`Failed to update workflow ${id} in n8n`);
  }
}

/**
 * Delete a workflow
 */
export async function deleteWorkflow(id: string): Promise<void> {
  try {
    await n8nApiClient.delete(`/workflows/${id}`);
  } catch (error) {
    console.error(`Error deleting workflow ${id}:`, error);
    throw new Error(`Failed to delete workflow ${id} from n8n`);
  }
}
