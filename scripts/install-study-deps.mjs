import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const target = join(root, "tools", "study", "python-packages");
const requirements = [
  join(root, "tools", "study", "requirements.txt"),
  ...(process.argv.includes("--plot") ? [join(root, "tools", "study", "requirements-plot.txt")] : [])
];
const candidates = [process.env.PYTHON, "python3", "python"].filter(Boolean);

mkdirSync(target, { recursive: true });

let last;
for (const python of candidates) {
  const version = spawnSync(python, ["--version"], { encoding: "utf8" });
  if (version.status !== 0) {
    last = version.stderr || version.error?.message;
    continue;
  }

  const install = spawnSync(python, [
    "-m",
    "pip",
    "install",
    "--disable-pip-version-check",
    "--target",
    target,
    ...requirements.flatMap((file) => ["-r", file])
  ], {
    encoding: "utf8",
    stdio: "inherit"
  });

  if (install.status === 0) {
    console.log(`Study Python dependencies installed with ${python}`);
    process.exit(0);
  }
  last = install.stderr || install.error?.message;
}

console.error("Could not install study Python dependencies.");
if (last) console.error(last);
process.exit(1);
