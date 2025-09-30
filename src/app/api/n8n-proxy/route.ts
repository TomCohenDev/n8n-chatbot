import { NextRequest, NextResponse } from "next/server";

const N8N_API_URL = process.env.N8N_API_URL || "http://localhost:5678/api/v1";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Sanitize workflow: n8n rejects additional properties on create
    const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]) =>
      Object.fromEntries(
        keys.filter((k) => k in obj).map((k) => [k, (obj as any)[k]])
      );

    const sanitizeNode = (node: any) =>
      pick(node, [
        "id",
        "name",
        "type",
        "typeVersion",
        "position",
        "parameters",
        "credentials",
      ]);

    const sanitizeConnections = (connections: any) => connections || {};

    const sanitized = {
      ...pick(body, ["name", "settings", "active"]),
      nodes: Array.isArray(body?.nodes) ? body.nodes.map(sanitizeNode) : [],
      connections: sanitizeConnections(body?.connections),
    } as any;

    const response = await fetch(`${N8N_API_URL}/workflows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(N8N_API_KEY && { "X-N8N-API-KEY": N8N_API_KEY }),
      },
      body: JSON.stringify(sanitized),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `n8n API error: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 }
    );
  }
}
