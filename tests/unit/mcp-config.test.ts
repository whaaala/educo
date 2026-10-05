import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * THE MCP SERVER COMMAND MUST BE SOMETHING WINDOWS CAN ACTUALLY SPAWN.
 *
 * `.mcp.json` said `"command": "npx"` from the day it was written, and the Playwright MCP server
 * failed to connect in EVERY session on this machine — reported as `CONNECT_TIMEOUT` after 30s,
 * which reads like a slow server and is nothing of the kind.
 *
 * On Windows `npx` is `npx.cmd`, a batch file. An MCP client spawns its servers WITHOUT a shell, and
 * `CreateProcess` will not launch a `.cmd` without one: the spawn fails with ENOENT in ~13ms. Nothing
 * ever speaks the protocol, so the client waits out its full deadline and reports a timeout. The
 * measurement that separates the two: spawning `npx` with `shell:true` handshakes in ~2.4s, and with
 * `shell:false` it does not start at all.
 *
 * Neither of the two things that LOOK like causes is one. Under 16-core CPU saturation the handshake
 * still completed in 3.4s, and with the npm registry pointed at an unreachable host it completed in
 * 2.0s — `npx` resolves the already-installed copy without the network. The only variable that
 * changes the outcome is whether a shell is involved.
 *
 * So the command must name a real executable on PATH (`node`), pointing at the package's own entry
 * script — which handshakes in ~0.8s and is spawnable with or without a shell, on every platform.
 * This is also more portable than `npx`, not less: the entry point is a declared devDependency, so it
 * is present after `npm install` and never fetched at launch.
 */

const MCP_PATH = resolve(process.cwd(), ".mcp.json");

/**
 * Commands that only exist as shell shims on Windows. Every one of these is a batch file (`.cmd`) that
 * a shell-less spawn cannot execute, so naming one here is the bug this test exists to catch.
 */
const SHELL_ONLY_ON_WINDOWS = ["npx", "npm", "yarn", "pnpm", "bunx"];

type McpServer = { command?: string; args?: string[]; type?: string };

const config = JSON.parse(readFileSync(MCP_PATH, "utf8").replace(/\r\n/g, "\n")) as {
  mcpServers?: Record<string, McpServer>;
};
const servers = Object.entries(config.mcpServers ?? {});

describe(".mcp.json", () => {
  it("declares at least one server, so an empty file cannot pass the checks below vacuously", () => {
    expect(servers.length).toBeGreaterThan(0);
  });

  it.each(servers)("%s: is spawned through a real executable, never a shell-only shim", (_name, server) => {
    // Compared without an extension and case-insensitively: "NPX.CMD" is the same bug as "npx".
    const command = (server.command ?? "").replace(/\.(cmd|bat|exe|ps1)$/i, "").toLowerCase();
    expect(command).not.toBe("");
    expect(SHELL_ONLY_ON_WINDOWS).not.toContain(command);
  });

  it.each(servers)("%s: the script it runs is present in the checkout", (_name, server) => {
    // A `node <script>` command is only as good as the script existing. `npx` hid this by fetching on
    // demand; naming the file means a missing dependency fails here rather than at session start.
    const script = (server.args ?? []).find((a) => /\.(js|mjs|cjs)$/i.test(a));
    if (!script) return; // a server that takes no script argument has nothing to check
    expect(existsSync(resolve(process.cwd(), script))).toBe(true);
  });

  it.each(servers)("%s: names the package it runs as a dependency, so `npm install` provides it", (_name, server) => {
    const script = (server.args ?? []).find((a) => /node_modules\//.test(a));
    if (!script) return;
    // "./node_modules/@playwright/mcp/cli.js" → "@playwright/mcp"
    const after = script.slice(script.indexOf("node_modules/") + "node_modules/".length);
    const parts = after.split("/");
    const pkg = parts[0].startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];
    // Line endings normalised at the point of READING, per `source-reading-tests.test.ts` — a CRLF checkout
    // otherwise breaks any assertion that spans a line break. JSON.parse survives CRLF, but the rule is the
    // rule precisely so nobody has to work out which readers are exceptions.
    const pkgJson = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8").replace(/\r\n/g, "\n")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const declared = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
    expect(Object.keys(declared)).toContain(pkg);
  });
});
