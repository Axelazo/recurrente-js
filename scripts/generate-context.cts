import fs from "node:fs";
import path from "node:path";

// --- Configuration ---
const OUTPUT_DIR = "ai-context";
const ALLOWED_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".css",
  ".prisma",
  ".env.example",
  ".sql",
  ".gitignore",
];
// CORRECTED: This list is now for both files and directories.
const IGNORED_ITEMS = [
  "node_modules",
  ".next",
  ".vercel",
  "dist",
  "build",
  ".git",
  ".cache",
  "scripts",
  "react-email-starter",
  "package-lock.json", // This will now be correctly ignored
];
// --------------------

/**
 * Recursively finds all files in a directory that match the allowed extensions.
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    // *** FIX: Check EVERY item (file or directory) against the ignore list first ***
    if (IGNORED_ITEMS.includes(item.name)) {
      continue; // Skip this item entirely
    }

    const fullPath = path.join(dirPath, item.name);

    if (item.isDirectory()) {
      // The ignore check is already done, so we just recurse.
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      // It's a file. The ignore check was already done.
      // Now, we just check its extension.
      if (ALLOWED_EXTENSIONS.includes(path.extname(item.name))) {
        arrayOfFiles.push(fullPath);
      }
    }
  }

  return arrayOfFiles;
}

/**
 * Generates a timestamp string in the format YYYYMMDD_HHMMSS.
 */
function getFormattedTimestamp(): string {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const DD = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${YYYY}${MM}${DD}_${HH}${mm}${ss}`;
}

/**
 * Main script logic.
 */
async function main() {
  const targetPath = process.argv[2];
  if (!targetPath) {
    console.error(
      "❌ Error: Please provide a file or directory path as an argument."
    );
    console.log("   Example: npm run context -- .");
    process.exit(1);
  }

  const fullPath = path.resolve(targetPath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Error: Path not found: ${fullPath}`);
    process.exit(1);
  }

  let filesToProcess: string[] = [];
  const stats = fs.statSync(fullPath);

  if (stats.isDirectory()) {
    console.log(`🔎 Scanning directory: ${targetPath}`);
    filesToProcess = getAllFiles(fullPath);
  } else if (stats.isFile()) {
    // *** FIX: Also check if a single targeted file is on the ignore list ***
    if (IGNORED_ITEMS.includes(path.basename(fullPath))) {
      console.log(`🟡 File '${targetPath}' is in the ignore list. Exiting.`);
      return;
    }
    console.log(`🎯 Targeting single file: ${targetPath}`);
    if (ALLOWED_EXTENSIONS.includes(path.extname(fullPath))) {
      filesToProcess = [fullPath];
    }
  }

  if (filesToProcess.length === 0) {
    console.log("🟡 No relevant files found to process. Exiting.");
    return;
  }

  console.log(`📚 Found ${filesToProcess.length} file(s) to process.`);

  const outputData = {
    metadata: {
      sourcePath: targetPath,
      timestamp: new Date().toISOString(),
      fileCount: filesToProcess.length,
    },
    files: {} as Record<string, string>,
  };

  for (const file of filesToProcess) {
    const relativePath = path.relative(process.cwd(), file);
    try {
      const content = fs.readFileSync(file, "utf-8");
      outputData.files[relativePath] = content;
    } catch (error) {
      console.warn(`⚠️  Could not read file: ${relativePath}`, error);
    }
  }

  // Ensure the output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const baseName = path.basename(targetPath).replace(/[.\\/]/g, "_");
  const timestamp = getFormattedTimestamp();
  const outputFilename = `context-${baseName}-${timestamp}.json`;
  const outputFilePath = path.join(OUTPUT_DIR, outputFilename);

  fs.writeFileSync(outputFilePath, JSON.stringify(outputData, null, 2));

  console.log(`\n✅ Success! Context saved to: ${outputFilePath}`);
}

main().catch(console.error);
