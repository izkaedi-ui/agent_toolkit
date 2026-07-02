# MCP Client Examples

Example request payload structure for lists and calls:

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/list" }
{ "jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": { "name": "agent_os.score" } }
```
