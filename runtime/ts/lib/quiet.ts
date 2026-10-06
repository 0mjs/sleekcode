// Loaded by `sk test`: keeps test output to pass/fail. Your console.logs show in `sk play`.
// (console.error is left alone, so real problems still surface.)
for (const method of ["log", "info", "debug"] as const) console[method] = () => {};
