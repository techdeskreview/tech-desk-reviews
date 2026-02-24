import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const IMAGE_DIR = path.join(SRC_DIR, "assets", "images");
const INDEX_HTML = path.join(ROOT, "index.html");

const SOURCE_FILE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".html",
  ".css",
  ".scss",
  ".sass",
  ".less",
]);

const IMAGE_REFERENCE_PATTERN =
  /(?:\/assets\/images|assets\/images)\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|gif|webp|svg|avif|ico|bmp)/g;

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function walkFiles(dirPath) {
  const output = [];
  for (const entry of readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      output.push(...walkFiles(fullPath));
      continue;
    }
    output.push(fullPath);
  }
  return output;
}

function isSourceFile(filePath) {
  return SOURCE_FILE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function lineFromIndex(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

function collectImages() {
  if (!existsSync(IMAGE_DIR)) {
    throw new Error(`Image directory not found: ${IMAGE_DIR}`);
  }

  const imageFiles = walkFiles(IMAGE_DIR);
  const exactPaths = new Set();
  const lowercaseLookup = new Map();
  const invalidNames = [];

  for (const filePath of imageFiles) {
    const relativeFromSrc = toPosix(path.relative(SRC_DIR, filePath));
    const assetPath = `/${relativeFromSrc}`;
    const relativeFromImageRoot = toPosix(path.relative(IMAGE_DIR, filePath));

    const hasUppercase = /[A-Z]/.test(relativeFromImageRoot);
    const hasSpaces = /\s/.test(relativeFromImageRoot);
    const hasNonAscii = /[^\x00-\x7F]/.test(relativeFromImageRoot);

    if (hasUppercase || hasSpaces || hasNonAscii) {
      invalidNames.push(relativeFromImageRoot);
    }

    exactPaths.add(assetPath);
    lowercaseLookup.set(assetPath.toLowerCase(), assetPath);
  }

  return { exactPaths, lowercaseLookup, invalidNames };
}

function collectReferences() {
  const sourceFiles = walkFiles(SRC_DIR).filter(isSourceFile);
  if (existsSync(INDEX_HTML)) sourceFiles.push(INDEX_HTML);

  const references = new Map();

  for (const sourceFile of sourceFiles) {
    const content = readFileSync(sourceFile, "utf8");
    const relativePath = toPosix(path.relative(ROOT, sourceFile));

    for (const match of content.matchAll(IMAGE_REFERENCE_PATTERN)) {
      const rawReference = match[0];
      const normalizedReference = rawReference.startsWith("/")
        ? rawReference
        : `/${rawReference}`;
      const line = lineFromIndex(content, match.index ?? 0);
      const location = `${relativePath}:${line}`;

      const locations = references.get(normalizedReference) ?? [];
      locations.push(location);
      references.set(normalizedReference, locations);
    }
  }

  return references;
}

function main() {
  const { exactPaths, lowercaseLookup, invalidNames } = collectImages();
  const references = collectReferences();

  const missingReferences = [];
  const caseMismatches = [];

  for (const [reference, locations] of references.entries()) {
    if (exactPaths.has(reference)) continue;

    const expected = lowercaseLookup.get(reference.toLowerCase());
    if (expected) {
      caseMismatches.push({ reference, expected, locations });
      continue;
    }

    missingReferences.push({ reference, locations });
  }

  console.log(`Image files found: ${exactPaths.size}`);
  console.log(`Image references found: ${references.size}`);

  if (
    invalidNames.length === 0 &&
    caseMismatches.length === 0 &&
    missingReferences.length === 0
  ) {
    console.log("Image path validation passed.");
    return;
  }

  if (invalidNames.length > 0) {
    console.error("\nInvalid image file names (must be lowercase/no spaces/no accents):");
    for (const name of invalidNames) {
      console.error(`- ${name}`);
    }
  }

  if (caseMismatches.length > 0) {
    console.error("\nCase mismatches detected:");
    for (const mismatch of caseMismatches) {
      console.error(`- Ref: ${mismatch.reference}`);
      console.error(`  Expected: ${mismatch.expected}`);
      console.error(`  Used at: ${mismatch.locations.join(", ")}`);
    }
  }

  if (missingReferences.length > 0) {
    console.error("\nMissing image references detected:");
    for (const missing of missingReferences) {
      console.error(`- Ref: ${missing.reference}`);
      console.error(`  Used at: ${missing.locations.join(", ")}`);
    }
  }

  process.exitCode = 1;
}

main();
