import { basename } from "node:path";
import { tilde } from "./paths";
import type { Workspace } from "./workspace";

/** Opens a problem's README + solution in the configured editor. */
export function openInEditor(ws: Workspace, files: string[]) {
  const editor = ws.config.editor;

  if (editor === "terminal") {
    // $VISUAL / $EDITOR in this terminal. vim-likes get the README and solution side by side.
    const cmd = (process.env.VISUAL || process.env.EDITOR || "vim").split(" ");
    const sideBySide = ["vim", "nvim", "vi"].includes(basename(cmd[0]!));
    const args = sideBySide ? ["-O", ...files] : [files.at(-1)!];
    Bun.spawnSync([...cmd, ...args], { cwd: ws.dir, stdio: ["inherit", "inherit", "inherit"] });
    return;
  }

  const apps: Partial<Record<typeof editor, [string, string]>> = {
    zed: ["zed", "Zed"],
    vscode: ["code", "Visual Studio Code"],
    cursor: ["cursor", "Cursor"],
  };
  const app = apps[editor];
  if (app) {
    const [cli, name] = app;
    try {
      Bun.spawn(Bun.which(cli) ? [cli, ws.dir, ...files] : ["open", "-a", name, ws.dir, ...files], { stdio: ["ignore", "ignore", "ignore"] });
      return;
    } catch {}
  }
  for (const f of files) console.log(`   ${tilde(f)}`);
}
