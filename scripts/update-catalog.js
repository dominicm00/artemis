#!/usr/bin/env node

import { readFile, writeFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceFile = join(__dirname, "..", "pnpm-workspace.yaml");

async function getLatestVersion(packageName) {
  try {
    const { stdout } = await execAsync(`npm view ${packageName} version`);
    return stdout.trim();
  } catch (error) {
    console.error(
      `Failed to get latest version for ${packageName}:`,
      error.message,
    );
    return null;
  }
}

async function updateCatalog() {
  console.log("Reading pnpm-workspace.yaml...");
  const content = await readFile(workspaceFile, "utf8");

  // Parse the catalog section
  const catalogMatch = content.match(/catalog:\s*\n([\s\S]*?)(?=\n\S|\n*$)/);
  if (!catalogMatch) {
    console.error("No catalog section found in pnpm-workspace.yaml");
    process.exit(1);
  }

  const catalogSection = catalogMatch[1];
  const lines = catalogSection.split("\n");

  console.log("Checking for updates...");
  const updates = [];
  let updatedSection = "";

  for (const line of lines) {
    // Match package entries (e.g., "package-name": "version")
    const match = line.match(/^(\s*)"([^"]+)":\s*"([^"]+)"/);

    if (match) {
      const [fullMatch, indent, packageName, currentVersion] = match;
      const latestVersion = await getLatestVersion(packageName);

      if (latestVersion && latestVersion !== currentVersion) {
        console.log(`✓ ${packageName}: ${currentVersion} → ${latestVersion}`);
        updates.push({ packageName, currentVersion, latestVersion });
        updatedSection += `${indent}"${packageName}": "${latestVersion}"\n`;
      } else if (latestVersion) {
        console.log(`  ${packageName}: ${currentVersion} (up to date)`);
        updatedSection += line + "\n";
      } else {
        // Keep the line as-is if we couldn't fetch the version
        updatedSection += line + "\n";
      }
    } else {
      // Keep non-package lines (comments, empty lines, etc.)
      updatedSection += line + "\n";
    }
  }

  if (updates.length === 0) {
    console.log("\nAll packages are up to date!");
    return;
  }

  // Remove the last newline to match the original format
  updatedSection = updatedSection.trimEnd();

  // Replace the catalog section in the original content
  const newContent = content.replace(
    /catalog:\s*\n[\s\S]*?(?=\n\S|\n*$)/,
    `catalog:\n${updatedSection}`,
  );

  console.log(`\nWriting ${updates.length} updates to pnpm-workspace.yaml...`);
  await writeFile(workspaceFile, newContent);

  console.log("\nRunning pnpm install to apply updates...");
  try {
    const { stdout, stderr } = await execAsync("pnpm install", {
      cwd: join(__dirname, ".."),
    });
    if (stderr) console.error(stderr);
    if (stdout) console.log(stdout);
    console.log("\n✅ Catalog updated successfully!");
  } catch (error) {
    console.error("Failed to run pnpm install:", error.message);
    console.log('\nPlease run "pnpm install" manually to apply the updates.');
  }
}

// Run the update
updateCatalog().catch(console.error);
