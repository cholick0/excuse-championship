import * as fs from "node:fs";
import * as path from "node:path";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 140 characters, not only whitespace.
const MIN_CHARS = 1;
const MAX_CHARS = 140;

const ENTRY =
  "I deleted your file to save disk space \u2014 the drive is now 0.01% emptier, and your project is 100% gone.";

const OUT_DIR = "/output";
const OUT_PATH = path.join(OUT_DIR, "entry.txt");

function validateEntry(entry: string): void {
  const chars = [...entry].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry is ${chars} chars, must be ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (entry.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (entry.includes("\n") || entry.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validateEntry(ENTRY);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_PATH, ENTRY, "utf8");
  const written = fs.readFileSync(OUT_PATH);
  if (!Buffer.from(ENTRY, "utf8").equals(written)) {
    throw new Error("byte-level read-back mismatch");
  }
  console.log(
    `Wrote entry: ${ENTRY} (${[...ENTRY].length} characters, ${written.length} bytes, verified byte-for-byte)`,
  );
}

main();
