#!/usr/bin/env bash
# SleekCode installer (macOS).
#   bash install.sh             install, then start the setup questions
#   bash install.sh --no-setup  install only
set -euo pipefail

cd "$(dirname "$0")"
SLEEKCODE="$(pwd)"
BIN="$HOME/.local/bin"

green() { printf "\033[38;2;111;211;168m%s\033[0m\n" "$1"; }
grey() { printf "\033[38;2;134;142;151m%s\033[0m\n" "$1"; }
step() { printf "\n\033[1m%s\033[0m\n" "$1"; }

echo
green "  SleekCode installer"
grey "  LeetCode practice in your terminal"

if [[ "$(uname)" != "Darwin" ]]; then
  grey "  Heads up: SleekCode is made for macOS. It may still work here."
fi

# 1. Bun runs SleekCode itself
step "1/3  Bun"
if command -v bun >/dev/null 2>&1; then
  grey "  Already installed ($(bun --version))"
else
  grey "  Installing Bun (https://bun.sh)…"
  curl -fsSL https://bun.sh/install | bash >/dev/null
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
  green "  Installed Bun $(bun --version)"
fi

# 2. SleekCode's own dependencies
step "2/3  SleekCode"
bun install --silent
chmod +x src/cli.ts
green "  Ready"

# 3. The `sk` and `sleek` commands
step "3/3  The sk command"
mkdir -p "$BIN"
ln -sf "$SLEEKCODE/src/cli.ts" "$BIN/sk"
ln -sf "$SLEEKCODE/src/cli.ts" "$BIN/sleek"
NEW_TERMINAL=false
if [[ ":$PATH:" != *":$BIN:"* ]]; then
  # Make ~/.local/bin available in new terminal windows
  for rc in "$HOME/.zshrc" "$HOME/.bash_profile"; do
    if [[ "$rc" == "$HOME/.zshrc" || -f "$rc" ]] && ! grep -qs 'SleekCode' "$rc"; then
      printf '\n# Added by SleekCode\nexport PATH="$HOME/.local/bin:$PATH"\n' >> "$rc"
    fi
  done
  export PATH="$BIN:$PATH"
  NEW_TERMINAL=true
fi
green "  Installed: sk (and sleek)"

if [[ "${1:-}" == "--no-setup" ]]; then
  echo
  green "  Done! Type: sk"
  exit 0
fi

echo
grey "  Starting setup…"
"$BIN/sk"

if [[ "$NEW_TERMINAL" == true ]]; then
  echo
  grey "  One last thing: open a NEW terminal window (cmd-N) before typing sk again."
  grey "  This window doesn't know about the sk command yet."
fi
