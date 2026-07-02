# JSON RPC Protocol Spec

Follows standard JSON-RPC 2.0 formatting:
- Must include `jsonrpc: "2.0"` in all messages.
- Must preserve request `id` in responses.
- Errors must contain `code` and `message` properties.
