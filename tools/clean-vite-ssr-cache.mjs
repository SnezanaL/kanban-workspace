import fs from 'node:fs/promises';
import path from 'node:path';

const workspaceRoot = process.cwd();
const angularCacheRoot = path.join(workspaceRoot, '.angular', 'cache');
const apps = ['kanban-signal', 'kanban-ngxs'];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function rmWithRetries(targetPath, attempts = 6, delayMs = 150) {
  for (let i = 0; i < attempts; i++) {
    try {
      await fs.rm(targetPath, { recursive: true, force: true });
      return;
    } catch (e) {
      if (i === attempts - 1) throw e;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

async function main() {
  if (!(await exists(angularCacheRoot))) return;

  const versions = await fs.readdir(angularCacheRoot).catch(() => []);

  const deletions = [];
  for (const version of versions) {
    for (const app of apps) {
      const viteDir = path.join(angularCacheRoot, version, app, 'vite');
      const depsSsr = path.join(viteDir, 'deps_ssr');

      if (await exists(depsSsr)) {
        deletions.push(rmWithRetries(depsSsr));
      }

      // delete any deps_ssr_temp_* dirs
      const viteChildren = await fs.readdir(viteDir).catch(() => []);
      for (const child of viteChildren) {
        if (child.startsWith('deps_ssr_temp_')) {
          deletions.push(rmWithRetries(path.join(viteDir, child)));
        }
      }
    }
  }

  await Promise.allSettled(deletions);
}

await main();
