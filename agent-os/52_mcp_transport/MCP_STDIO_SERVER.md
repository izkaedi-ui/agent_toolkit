# MCP Stdio Server

Detailing the runtime stdio loop mapping:
- Reads from stdin line-by-line.
- Parses JSON-RPC request objects.
- Dispatches tools using child processes.
- Writes outputs to stdout.
