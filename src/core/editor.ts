import { tilde } from "./paths";
import type { Workspace } from "./workspace";

/** Opens files in the configured editor (in the workspace's window). */
export function openInEditor(ws: Workspace, files: string[]) {
  const launch = (cli: string, app: string) => {
    const cmd = Bun.which(cli) ? [cli, ws.dir, ...files] : ["open", "-a", app, ws.dir, ...files];
    try {
      Bun.spawn(cmd, { stdio: ["ignore", "ignore", "ignore"] });
      return true;
    } catch {
      return false;
    }
  };
  const ok = ws.config.editor === "zed" ? launch("zed", "Zed") : ws.config.editor === "vscode" ? launch("code", "Visual Studio Code") : false;
  if (!ok) for (const f of files) console.log(`   open ${tilde(f)}`);
}
