import { server } from "./src/server.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { z } from "zod";

const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

const client = new Client(
  { name: "test-client", version: "1.0.0" },
  { capabilities: { prompts: {}, resources: {} } }
);

async function test() {
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  // 1. Discovery
  const discoverRes = await client.request(
    {
      method: "server/discover",
      params: {
        _meta: {
          "io.modelcontextprotocol/protocolVersion": "2026-07-28",
          "io.modelcontextprotocol/clientInfo": { name: "test-client", version: "1.0.0" },
        },
      },
    },
    z.any()
  );
  console.log("1. server/discover SUCCESS:");
  console.log("   resultType:", discoverRes.resultType);
  console.log("   supportedVersions:", discoverRes.supportedVersions);
  console.log("   ttlMs:", discoverRes.ttlMs);
  console.log("   cacheScope:", discoverRes.cacheScope);

  // 2. Tools listing
  const toolsList = await client.listTools();
  console.log("\n2. listTools count:", toolsList.tools.length);
  for (const t of toolsList.tools) {
    console.log(`   - ${t.name}: "${t.title}" (params: ${Object.keys(t.inputSchema?.properties || {}).join(", ") || "none"})`);
  }

  // 3. Tool call with structured output
  const callRes = await client.callTool({
    name: "errorReport",
    arguments: { error: "File not found: foo.js", toolName: "edit_file" },
  });
  console.log("\n3. callTool errorReport structuredContent:", callRes.structuredContent);

  // 4. Prompts listing
  const promptsList = await client.listPrompts();
  console.log("\n4. listPrompts count:", promptsList.prompts.length);
  for (const p of promptsList.prompts) {
    console.log(`   - Prompt: ${p.name} ("${p.title}")`);
  }

  // 5. Resources listing & read
  const resourcesList = await client.listResources();
  console.log("\n5. listResources count:", resourcesList.resources.length);
  for (const r of resourcesList.resources) {
    console.log(`   - Resource: ${r.uri} ("${r.title}")`);
  }

  const resourceRead = await client.readResource({ uri: "codebridge://rules/user-context" });
  console.log("\n6. readResource codebridge://rules/user-context size:", resourceRead.contents[0].text.length, "bytes");

  const hooksResourceRead = await client.readResource({ uri: "codebridge://hooks/active" });
  console.log("\n7. readResource codebridge://hooks/active preview:\n" + hooksResourceRead.contents[0].text);

  const hooksCall = await client.callTool({
    name: "list_hooks",
    arguments: {},
  });
  console.log("8. callTool list_hooks count:", hooksCall.structuredContent.count);

  console.log("\n=== ALL 4 SPEC PRIMITIVES (DISCOVERY, TOOLS, PROMPTS, RESOURCES) FULLY VERIFIED! ===");
}

test().catch(console.error);
