import { z } from 'zod';

export const n8nNodeSchema = z.object({
  id: z.string().min(1, 'Node ID is required'),
  name: z.string().min(1, 'Node name is required'),
  type: z.string().min(1, 'Node type is required'),
  typeVersion: z.number().int().positive(),
  position: z.tuple([z.number(), z.number()]),
  parameters: z.record(z.unknown()),
  credentials: z.record(z.unknown()).optional(),
});

export const n8nConnectionSchema = z.object({
  node: z.string(),
  type: z.string(),
  index: z.number().int().nonnegative(),
});

export const n8nWorkflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  nodes: z.array(n8nNodeSchema).min(1, 'At least one node is required'),
  connections: z.record(
    z.object({
      main: z.array(z.array(n8nConnectionSchema)),
    })
  ),
  active: z.boolean().optional(),
  settings: z.record(z.unknown()).optional(),
  staticData: z.record(z.unknown()).optional(),
});

export type N8nNodeInput = z.infer<typeof n8nNodeSchema>;
export type N8nConnectionInput = z.infer<typeof n8nConnectionSchema>;
export type N8nWorkflowInput = z.infer<typeof n8nWorkflowSchema>;

export function validateWorkflow(data: unknown) {
  return n8nWorkflowSchema.safeParse(data);
}
