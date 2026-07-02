# MCP Transport Implementation

> **No claim may exceed evidence.**

## Required for full MCP compliance

A toolkit is MCP-shaped only when tools can be discovered and invoked through an MCP-compatible transport.

### stdio transport

- Start process with `node mcp-server.mjs`
- Reads JSON-RPC from stdin, writes to stdout
- Supports `tools/list`, `tools/call`

### HTTP/SSE transport

- `POST /tools/call` with JSON body
- `GET /tools/list` returns tool manifest
- SSE stream for streaming results

### Tool discovery schema

```json
{
  "tools": [
    {
      "name": "audit_large_3d",
      "description": "Audit a Three.js scene for large-3D risks",
      "inputSchema": { "$ref": "Large3dMetrics" }
    }
  ]
}
```

### Auth boundaries

- Local stdio: no auth required
- HTTP: ****** or API key header required
- Version negotiation via `X-MCP-Version` header

> No claim may exceed evidence.
