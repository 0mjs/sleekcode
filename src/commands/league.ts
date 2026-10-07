// sk league: a private leaderboard with friends, through a GitHub repo (via the gh CLI).
//   sk league [number]   leaderboard (or a problem head to head)   ·   -c create  -i invite  -j join  -l leave  -d delete
import * as p from "@clack/prompts";
import { rmSync } from "node:fs";
import { parse } from "../core/args";
import { loadConfig, saveConfig, type Config } from "../core/config";
import { formatDuration } from "../core/duration";
import { LANGUAGES } from "../core/languages";
import {
  activity, ago, cloneLeague, gh, githubLogin, ghLoggedIn, hasGh, howLabel, isLeagueClone, LEAGUE_DESCRIPTION, LEAGUE_DIR,
  publish, publishNow, pullLeague, readPlayers, run, standing, writeLeagueFiles,
} from "../core/league";
import { findProblem, type Workspace } from "../core/workspace";
import { bold, c, diffColor, pad, padL, rgb } from "../ui/colors";
import { ask } from "./log";

/** gh installed and logged in, or help getting there */
async function ensureGh(): Promise<boolean> {
  if (!hasGh()) {
    p.log.warn("Leagues use GitHub's command-line tool, gh, which isn't installed.");
    if (Bun.which("brew")) {
      const ok = ask(await p.confirm({ message: "Install it now with Homebrew (brew install gh)?", initialValue: true }));
      if (!ok) return false;
      const r = Bun.spawnSync(["brew", "install", "gh"], { stdio: ["inherit", "inherit", "inherit"] });
      if (r.exitCode !== 0 || !hasGh()) return false;
    } else {
      p.log.message(`Install it from ${c.ink("https://cli.github.com")}, then run ${c.ink("sk league")} again.`);
      return false;
    }
  }
  if (!ghLoggedIn()) {
    p.log.message("Sign in to GitHub (a browser window opens):");
    Bun.spawnSync(["gh", "auth", "login", "--web", "--git-protocol", "https"], { stdio: ["inherit", "inherit", "inherit"] });
    if (!ghLoggedIn()) return false;
  }
  return true;
}

type Invite = { id: number; repository: { full_name: string; description: string | null; owner: { login: string } } };
const pendingInvites = (): Invite[] => {
  const r = gh("api", "user/repository_invitations");
  try {
    return (JSON.parse(r.out || "[]") as Invite[]).filter((i) => i.repository.description?.includes("SleekCode league"));
  } catch {
    return [];
  }
};

async function joinRepo(ws: Workspace, config: Config, repo: string, inviteId?: number) {
  const spin = p.spinner();
  spin.start(`Joining ${repo}`);
  if (inviteId) gh("api", "-X", "PATCH", `user/repository_invitations/${inviteId}`);
  if (!cloneLeague(repo).ok || !isLeagueClone()) {
    spin.stop(c.red(`Couldn't open ${repo} as a league. Check the name, and that you've been invited.`));
    return;
  }
  const login = githubLogin();
  config.league = { repo, login, owner: repo.split("/")[0] === login };
  await saveConfig(config);
  const ok = await publish(ws, config);
  spin.stop(ok ? `${c.green("Joined")} ${c.ink(repo)} ${c.muted("· your solves are shared from now on")}` : c.amber("Joined, but publishing didn't work yet; it'll retry next time."));
  await view(ws, config);
}

async function create(ws: Workspace, config: Config) {
  if (!(await ensureGh())) return p.cancel("Leagues need gh. No changes made.");
  const login = githubLogin();
  const name = ask(await p.text({ message: "Name for your league (a private GitHub repo)", placeholder: "sleekcode-league", defaultValue: "sleekcode-league", validate: (s) => (s && !/^[\w.-]+$/.test(s) ? "Letters, numbers, - _ and . only" : undefined) }));
  const repo = `${login}/${name}`;
  const spin = p.spinner();
  spin.start(`Creating ${repo} (private)`);
  const made = gh("repo", "create", repo, "--private", "--description", LEAGUE_DESCRIPTION, "--add-readme");
  if (!made.ok) return spin.stop(c.red(`Couldn't create ${repo}: ${made.err.split("\n")[0]}`));
  if (!cloneLeague(repo).ok) return spin.stop(c.red("Created it, but couldn't download it. Try sk league -j " + repo));
  config.league = { repo, login, owner: true };
  await saveConfig(config);
  await writeLeagueFiles(repo, config);
  await publish(ws, config);
  spin.stop(`${c.green("League created:")} ${c.ink(`https://github.com/${repo}`)} ${c.muted("(private)")}`);
  await invite(config);
}

async function invite(config: Config, who?: string) {
  const league = config.league!;
  if (!league.owner && !process.env.SLEEKCODE_LEAGUE_LOGIN) return p.log.warn(`Only the league's creator (${league.repo.split("/")[0]}) can invite people.`);
  const names = who ?? ask(await p.text({ message: "Invite friends: GitHub usernames (separated by spaces or commas)", placeholder: "e.g. octocat", defaultValue: "" }));
  for (const user of names.split(/[\s,]+/).filter(Boolean)) {
    if (!gh("api", `users/${user}`).ok) {
      p.log.warn(`${user}: no GitHub user with that name.`);
      continue;
    }
    const r = gh("api", "-X", "PUT", `repos/${league.repo}/collaborators/${user}`, "-f", "permission=push");
    p.log[r.ok ? "success" : "warn"](r.ok ? `Invited ${user}. They run ${c.ink("sk league")} to join.` : `${user}: ${r.err.split("\n")[0]}`);
  }
}

async function leave(config: Config) {
  const league = config.league!;
  if (league.owner) p.log.warn(`You created this league. Leaving keeps it for everyone else; ${c.ink("sk league -d")} deletes it.`);
  const sure = ask(await p.confirm({ message: `Leave ${league.repo}? Your results are removed from it.`, initialValue: false }));
  if (!sure) return p.outro(c.muted("Still in the league."));
  if (pullLeague()) {
    rmSync(`${LEAGUE_DIR}/players/${league.login}.json`, { force: true });
    run(["git", "add", "-A"], LEAGUE_DIR);
    run(["git", "commit", "-q", "-m", `${league.login} left`], LEAGUE_DIR);
    run(["git", "push", "-q"], LEAGUE_DIR);
  }
  rmSync(LEAGUE_DIR, { recursive: true, force: true });
  delete config.league;
  await saveConfig(config);
  p.outro(c.green("Left the league."));
}

async function remove(config: Config) {
  const league = config.league!;
  if (!league.owner) {
    p.log.warn(`Only ${league.repo.split("/")[0]} (who created it) can delete this league.`);
    return leave(config);
  }
  const name = league.repo.split("/")[1]!;
  const typed = ask(await p.text({ message: `This deletes the GitHub repo ${league.repo} for everyone. Type its name to confirm`, placeholder: name }));
  if (typed !== name) return p.outro(c.muted("Name didn't match. Nothing deleted."));
  // Deleting a repo needs an extra GitHub permission the first time
  if (!gh("auth", "status").out.concat(gh("auth", "status").err).includes("delete_repo")) {
    p.log.message("GitHub needs your OK to let gh delete repos (a browser window may open):");
    Bun.spawnSync(["gh", "auth", "refresh", "-h", "github.com", "-s", "delete_repo"], { stdio: ["inherit", "inherit", "inherit"] });
  }
  const r = gh("repo", "delete", league.repo, "--yes");
  if (!r.ok) return p.outro(c.red(`Couldn't delete it: ${r.err.split("\n")[0]}`));
  rmSync(LEAGUE_DIR, { recursive: true, force: true });
  delete config.league;
  await saveConfig(config);
  p.outro(c.green(`Deleted ${league.repo}.`));
}

// ---------- the leaderboard ----------

const pct = (x: number) => `${Math.round(x * 100)}%`;

export function leaderboardLines(config: Config, width = 100): string[] {
  const players = readPlayers();
  const me = config.league?.login;
  const rows = players.map((pl) => ({ pl, s: standing(pl, config.graduateAfter) }))
    .sort((a, b) => b.s.solved - a.s.solved || b.s.mastered - a.s.mastered || b.s.cleanNow - a.s.cleanNow);
  const out = [
    `${c.muted(pad("#", 3))}${pad(c.muted("PLAYER"), 18)}${padL(c.muted("SOLVED"), 8)}${padL(c.muted("MASTERED"), 10)}${padL(c.muted("CLEAN NOW"), 11)}${padL(c.muted("STREAK"), 8)}${padL(c.muted("THIS WEEK"), 11)}${padL(c.muted("BLIND 75"), 10)}`,
  ];
  rows.forEach(({ pl, s }, i) => {
    const name = pl.login === me ? bold(c.green(pl.login)) : c.ink(pl.login);
    out.push(`${c.muted(pad(String(i + 1), 3))}${pad(name, 18)}${padL(c.ink(String(s.solved)), 8)}${padL(c.green(String(s.mastered)), 10)}${padL(c.body(pct(s.cleanNow)), 11)}${padL(c.amber(`${s.streak}d`), 8)}${padL(c.body(String(s.thisWeek)), 11)}${padL(c.body(`${s.blind}/75`), 10)}`);
  });
  out.push("", bold(c.green("RECENT")), "");
  for (const a of activity(players).slice(0, 10)) {
    const ok = a.total > 0 && a.pass === a.total;
    const how = howLabel(a).replace("their own", a.login === me ? "my own" : "their own");
    const title = `${a.id}. ${a.title}`;
    out.push(
      `${pad(a.login === me ? c.green(a.login) : c.ink(a.login), 14)}${pad(c.body(title.length > 30 ? title.slice(0, 29) + "…" : title), 32)}${ok ? c.green("✓") : c.red("✗")} ` +
        `${pad((a.help === "none" ? c.body : c.amber)(how), 26)}${padL(c.body(a.seconds == null ? "–" : formatDuration(a.seconds)), 8)}  ${pad((a.aboveTarget ? c.amber : c.muted)(a.complexity || "–"), 18)}${c.dim(ago(new Date(a.at)))}`,
    );
  }
  if (!players.length) out.push(c.muted("Nobody has published yet."));
  return out.map((l) => l.slice(0, width * 3));
}

function headToHead(ws: Workspace, config: Config, query: string): string[] {
  const me = config.league?.login;
  const prob = findProblem(ws, query);
  if (!prob) return [c.red(`No problem matching "${query}".`)];
  const out = [`${bold(c.ink(`${prob.id}. ${prob.title}`))} ${c.muted("·")} ${diffColor[prob.difficulty](prob.difficulty)}`, ""];
  for (const pl of readPlayers()) {
    const x = pl.problems[prob.folder];
    if (!x) {
      out.push(`${pad(c.ink(pl.login), 14)}${c.dim("not attempted yet")}`);
      continue;
    }
    const best = [...x.attempts].reverse().find((a) => a.total > 0 && a.pass === a.total) ?? x.attempts.at(-1)!;
    const lang = LANGUAGES[best.language as keyof typeof LANGUAGES];
    out.push(
      `${pad(c.ink(pl.login), 14)}${best.pass === best.total && best.total ? c.green("✓") : c.red("✗")} ${pad(c.body(pl.login === me ? howLabel(best).replace("their own", "my own") : howLabel(best)), 26)}${padL(c.body(best.seconds == null ? "–" : formatDuration(best.seconds)), 8)}  ` +
        `${pad((best.aboveTarget ? c.amber : c.body)(best.complexity || "–"), 20)}${lang ? rgb(lang.color)(lang.tag) : ""} ${c.muted(`· ${x.attempts.length} attempt${x.attempts.length > 1 ? "s" : ""}`)}`,
    );
  }
  return out;
}

async function view(ws: Workspace, config: Config, problem?: string) {
  pullLeague();
  const lines = problem ? headToHead(ws, config, problem) : leaderboardLines(config, process.stdout.columns || 100);
  const n = readPlayers().length;
  console.log(`\n  ${bold(c.green("LEAGUE"))} ${c.muted(`· ${config.league!.repo} · ${n} player${n === 1 ? "" : "s"}`)}\n`);
  for (const l of lines) console.log("  " + l);
  console.log(`\n  ${c.dim(problem ? "sk league for the leaderboard" : "sk league <number> for one problem head to head · on GitHub: https://github.com/" + config.league!.repo)}\n`);
}

export async function league(ws: Workspace, args: string[]) {
  // Internal: background publish after sk log / edits
  if (args.includes("--publish")) return publishNow(ws);
  const { values, positionals } = parse("league", args);
  const config = (await loadConfig())!;

  if (values.create) return create(ws, config);
  if (!config.league && (values.leave || values.delete || values.invite !== undefined)) {
    return console.log(`\n  ${c.muted("You're not in a league.")} ${c.ink("sk league")} ${c.muted("to create or join one.")}\n`);
  }
  if (!config.league) {
    if (values.join) {
      if (!(await ensureGh())) return p.cancel("Leagues need gh. No changes made.");
      const repo = typeof values.join === "string" && values.join ? values.join : undefined;
      const invites = pendingInvites();
      if (repo) return joinRepo(ws, config, repo, invites.find((i) => i.repository.full_name === repo)?.id);
    }
    // Not in a league: offer any invitations, or creating one
    p.intro(bold(" SleekCode league "));
    if (!(await ensureGh())) return p.cancel("Leagues need gh. No changes made.");
    const invites = pendingInvites();
    const choice = ask(await p.select({
      message: invites.length ? "You've been invited to a league!" : "You're not in a league yet",
      options: [
        ...invites.map((i) => ({ value: `invite:${i.id}:${i.repository.full_name}`, label: `Join ${i.repository.full_name}`, hint: `invited by ${i.repository.owner.login}` })),
        { value: "create", label: "Create a league", hint: "a private GitHub repo you invite friends to" },
        { value: "join", label: "Join one by name", hint: "owner/repo" },
        { value: "cancel", label: c.muted("Not now") },
      ],
    }));
    if (choice === "create") return create(ws, config);
    if (choice === "join") {
      const repo = ask(await p.text({ message: "League repo (owner/name)", placeholder: "friend/sleekcode-league" }));
      return joinRepo(ws, config, repo, invites.find((i) => i.repository.full_name === repo)?.id);
    }
    if (String(choice).startsWith("invite:")) {
      const [, id, repo] = String(choice).split(":");
      return joinRepo(ws, config, repo!, Number(id));
    }
    return p.outro(c.muted("Maybe later."));
  }

  if (values.invite !== undefined) return invite(config, typeof values.invite === "string" && values.invite ? values.invite : undefined);
  if (values.leave) return leave(config);
  if (values.delete) return remove(config);
  if (values.join) return p.log.warn(`You're already in ${config.league.repo}. Leave it first with sk league -l.`);
  return view(ws, config, positionals[0]);
}
