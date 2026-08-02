/* MCP 서버 자체 점검 — 도구를 실제로 호출해 결과를 찍어본다.
   사용: node selftest.js [도구이름] [JSON인자] */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const c = new Client({ name: 'selftest', version: '1.0.0' });
await c.connect(new StdioClientTransport({
  command: process.execPath,
  args: [path.join(HERE, 'server.js')],
  stderr: 'inherit',
}));

const tool = process.argv[2];
if (!tool) {
  const { tools } = await c.listTools();
  console.log(`도구 ${tools.length}개\n`);
  for (const t of tools) {
    console.log(`  ${t.name} — ${t.title || ''}`);
    console.log(`    ${(t.description || '').split('\n')[0]}`);
    console.log(`    인자: ${Object.keys(t.inputSchema?.properties || {}).join(', ') || '없음'}`);
  }
} else {
  const args = process.argv[3] ? JSON.parse(process.argv[3]) : {};
  const t0 = Date.now();
  const r = await c.callTool({ name: tool, arguments: args });
  console.log(r.content.map(x => x.text).join('\n'));
  console.log(`\n[${((Date.now() - t0) / 1000).toFixed(1)}초]`);
}
await c.close();
process.exit(0);
